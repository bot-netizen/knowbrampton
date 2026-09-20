# Brampton Votes — build plan

Renders: https://claude.ai/artifact/TUb1vygK6mTjJ4gbggGNdY
Verified facts + API inventory: ./VERIFIED-FACTS.md

---

## 0. The thing that changes the whole plan

**The election is Monday 26 October 2026. Not 2027.**

Ontario municipal elections run on the fourth Monday of October every four years.
2022 → 2026 → 2030. From today (20 Sept 2026):

- **36 days** to election day
- **19 days** to the first advance poll (9 Oct; then 10, 11, 16, 17 Oct)
- Nominations closed 21 Aug. Candidates certified 25 Aug. **The field is frozen.**

There is a 2027 date in this story, but it is not the election: candidate campaign
finance statements are filed *after* the vote and become public in early 2027.
That is probably where the 2027 came from.

So this is not a long project with a distant deadline. It is a **five-week sprint
followed by a four-year site.**

### The consequence: two phases, different products

| | Phase A — "help me vote" | Phase B — "hold them to it" |
|---|---|---|
| Window | now → 26 Oct 2026 | 27 Oct 2026 → Oct 2030 |
| Job | get someone to the right poll with an informed ballot | track the money and the promises |
| Pages | Ward finder, ballot, poll locations, Brampton 101, candidate list | Money running page, issues tracker, voting records, campaign finance |
| Fails if | it ships late | it goes stale |

Phase A is the part with a deadline. Everything in Phase B is better built after
26 October, when traffic drops and the winners are known. **Recommendation: cut
scope hard to Phase A, ship in ~10 days, then build Phase B with the pressure off.**

---

## 1. Architecture

Static-first. The data barely moves, traffic will spike hard on 26 Oct, and a static
site costs nothing and cannot fall over on election day.

```
  Python ETL (build time)          Static site                Runtime (tiny)
  ─────────────────────            ───────────                ──────────────
  ArcGIS feature services  ──┐
  Certified candidate list ──┼──►  /data/*.json  ──►  Next.js SSG  ──►  Cloudflare
  Budget docs (manual)     ──┤     committed to git      + TopoJSON       Pages
  eScribe minutes          ──┘     (= audit trail)       wards                │
                                                                              │
                                              advance-poll WAIT_TIME ─────────┘
                                              (client fetch, voting days only)
```

- **ETL in Python.** One script per source, output normalised JSON, commit it.
  Git history becomes the record of what changed and when — which matters when a
  candidate says "that's not what my page said last week."
- **Only two things are live:** the countdown, and `WAIT_TIME` on the advance-poll
  layer during voting days. Everything else is baked at build time. Cache the last
  good response and degrade to "wait times unavailable" rather than showing nothing.
- **Ward lookup runs in the browser.** Ship simplified ward polygons as TopoJSON
  (~60–100 KB), do point-in-polygon client-side. Nothing about the user's address
  is sent anywhere — which is both faster and the correct privacy posture.
- **Address → coordinates is the one hard part.** Options, in order of preference:
  1. Pre-build a postal-code → ward table. Geocode Brampton's ~10k full postal
     codes once at build time, ship the table. Fast, free, private, no runtime dep.
     (FSA / first-three-characters is too coarse — Brampton FSAs straddle wards.)
  2. Let people click the map. Ship this regardless as the fallback.
  3. Live geocoder (Nominatim / Google). Rate limits, attribution, cost, and it
     leaks addresses. Last resort.

Stack: Next.js static export + TypeScript, Tailwind or plain CSS modules, TopoJSON +
D3-geo for the map (no tile layer needed — the wards alone read better than a basemap).
Deploy Cloudflare Pages or Vercel. Python 3.13 for ETL, which matches what you
already run.

---

## 2. Data inventory — what is confirmed working

All Brampton layers live under one ArcGIS org, no API key, and they speak GeoJSON
natively (`f=geojson`), so they drop straight into a map.

```
BASE=https://services3.arcgis.com/rl7ACuZkiFsmDA2g/arcgis/rest/services
```

| Purpose | Layer | Status |
|---|---|---|
| Ward polygons | `Planning_Local_Government/FeatureServer/3` | ✅ 10 wards, pairings in `ELECTORAL_AREA` |
| Election-day polls | `2026VotingDayLocations_PRD/0` | ✅ 148 locations, ward + accessibility |
| Advance polls | `2026AdvanceVotingLocations_PRD/0` | ✅ 10 locations, dates, **`WAIT_TIME`** |
| Poll subdivisions | `Brampton_Elections/0` | ✅ `POLL_ID`, ward, subdivision |
| Current council | `Term_of_Council_Elected_Officials_2022_to_2026/0` | ✅ names, roles, email, phone, headshots |
| 2018 results **by poll** | `2018_Election_Results/0` | ✅ office, candidate, votes per location |
| Capital works | `ParksConstructionProjects`, `Roadworks_Archive`, `BramptonWorks_OpenData` | ✅ |
| Official plan | `Brampton_Plan_Schedule_1A` … `_12` | ✅ all twelve schedules |
| Demographics | `Census_2021`, `Population_by_Age_and_Sex_2021` | ✅ |

516 services in total — the list is worth reading once in full.

Peel Region: `https://services6.arcgis.com/ONZht79c8QWuX759/arcgis/rest/services`
Council agendas/minutes/votes: `pub-brampton.escribemeetings.com` (HTML, needs scraping)
Certified candidates: brampton.ca election pages (HTML, needs scraping — do it once, it's frozen)

### Gotchas found
- `opendata.brampton.ca` **does not resolve.** Use `geohub.brampton.ca`.
- Lots of `_UAT`, `_DEV`, `_test` layers and a pile of Esri demo data (US election
  results, City of Boulder). Only trust `_PRD` or unsuffixed names.
- A global Hub search returns *other cities'* datasets. Always scope to the org id.
- Budget detail is **not** in the API. Operating/capital totals come from news
  releases; the service-area breakdown needs the budget book parsed by hand.

---

## 3. The integrity model — the spine of the whole thing

This is what makes the site worth existing instead of being another aggregator, and
it is also the legal shield. Every fact on the site is one of exactly three states:

| State | Means | Renders as |
|---|---|---|
| `verified` | Traced to a primary document, with URL and retrieval date | Teal badge |
| `attributed` | Someone else's claim, named and linked, quoted not paraphrased | Named inline |
| `unsourced` | We looked and found nothing | Amber outline, **left visibly empty** |

```python
@dataclass
class Fact:
    claim: str
    state: Literal["verified", "attributed", "unsourced"]
    source_name: str | None
    source_url: str | None
    quote: str | None          # verbatim, never paraphrased
    retrieved_at: date
```

Rules, non-negotiable:

1. **Never infer a candidate's position.** Not from party history, not from a donor
   list, not from a past job, not from "candidates like this usually think X".
   No position without a quote we can link.
2. **An empty slot is published as empty.** A silent candidate is a finding, not a gap.
3. **No endorsements, no scores, no grades.** The moment you grade candidates you
   become a campaign, with the legal status that implies (see §4).
4. **Right of reply before and after.** Email every candidate their page. Publish
   corrections with a date in a public changelog.
5. **Criticism is quoted and attributed, never absorbed into our voice.** "The
   Brampton Board of Trade argued X" — not "the budget is misleading."

The visible completeness counter on the issues page ("0 / 516 positions sourced")
is deliberate. It tells readers how finished the site is and it keeps you honest.

---

## 4. Legal and risk — read this before writing code

**a) Third-party advertising. The real one.** Under Ontario's *Municipal Elections
Act*, third-party advertising that promotes or opposes a candidate requires
registration with the City Clerk, with spending limits and filing obligations. A
purely informational site should sit outside that, but "purely informational" is
doing a lot of work in that sentence, and the line is not one to guess at 36 days
out. **Action: call or email the Brampton City Clerk's election office and ask
directly whether the site as described needs to register.** Get it in writing. Do
this in week one — it may constrain the design (it is the strongest argument for the
no-endorsements, no-scores rule).

**b) Do not look official.** The renders deliberately avoid City of Brampton
branding and carry "Independent guide · not the City of Brampton" under the masthead
on every page, plus a disclaimer in every footer. Keep both. A civic site that gets
mistaken for the Clerk's office during an election is a genuine problem, not a
cosmetic one.

**c) Defamation.** Ontario law, real candidates, five weeks before a vote. The
quote-attribute-link discipline in §3 is the defence. No characterisation, no
inference, right of reply logged.

**d) Open data licence — unconfirmed.** The GeoHub terms page returns 200 but I
could not extract licence text. Until confirmed: link and attribute, cache for
performance, do **not** mirror datasets wholesale or present them as your own.
**Action: confirm the licence.** Most Ontario municipalities use an Open Government
Licence that permits exactly what this needs, so this is likely a formality — but
verify it.

**e) Photos.** The City publishes headshots for *sitting* councillors only. For the
75 challengers there is no photo you have rights to. The renders use an initials
monogram — keep that rather than scraping social media.

**f) Privacy.** Do the ward lookup client-side and log nothing. Never put an address
in a query string or analytics event.

---

## 5. Page specification

Matching the eight artboards in the renders.

**Home** — countdown, the four-votes explainer, the 24% turnout hook, address box,
three doors, what's at stake, source footer. The address box is the primary action
and repeats down the page.

**My ward / my ballot** — *the highest-value page on the site.* Ward + pair, the four
races with candidate counts and incumbents, advance poll with hours and live wait
time, election-day polls. Ward map with your ward highlighted. All from live layers.

**Brampton 101** — ~700k residents, 10 wards, 5 pairs, 11 seats, 4 votes, 4 years.
Real ward map. Who holds each pair. The two-councils explainer — including that 3 of
Brampton's 9 Peel seats are chosen by council, not by you. "Who to phone about what"
four-way split (City / Region / school board / not on this ballot) is quietly the most
useful thing on the site. Four-year cycle timeline.

**Where the money goes** — running page. $1.0385B operating, $340.4M capital, 0% city
+ 1% hospital levy, $1,516/capita vs $1,819 GTA average, $163M reserves, $125M
hospital commitment. Three real charts. Then a two-column ledger: the case that it is
working / the case that it is not, every line attributed to whoever made it. Capital-
spend-by-ward map left as an explicit wireframe because project-level dollars are not
in the open data and inventing them is not an option.

**The problems** — six issues (health care, housing, transit, taxes and assets, growth
and planning, community safety). Each gets: measurable evidence, whose job it actually
is, and the candidate-position sourcing counter. Plus the four-step "how a position
gets onto this site" explainer.

**Election 2026** — 86 certified candidates. Mayor grid (12), then the five ward-pair
races with candidate counts and incumbents. Filters by office, ward, incumbency,
sourcing status.

**Candidate profile** — verified facts only, with explicit empty states. Tabs:
where they stand / record in office / campaign money / sources and corrections.
Completeness meter. "Are you this candidate?" correction route. Campaign money says
plainly that filings arrive in early 2027 — that absence is explained, not hidden.

**Phone** — ~70% of traffic will be mobile. The phone artboard is the real target;
the desktop ones are the secondary case.

---

## 6. Timeline — 36 days

**Days 1–3 · Foundation**
- Repo, Next.js static export, deploy pipeline, domain
- Python ETL for: wards, advance polls, voting-day polls, current council
- Commit the JSON. Ward TopoJSON built and size-checked
- **Send the Clerk the third-party-advertising question. Send the licence question.**

**Days 4–7 · The utility (this is the deadline-critical path)**
- Ward finder: postal-code table + map-click fallback
- My ward / my ballot page, fully working, mobile-first
- Candidate list scraped, normalised, committed (86 records, frozen field)
- Home page
- **Ship it.** A working ward finder live on day 7 beats a perfect site on day 30.

**Days 8–14 · Substance**
- Brampton 101
- Election 2026 list + 86 profile pages, all with honest empty states
- Email all 86 candidates: their page, the method, the correction route
- Money page with the verified figures and the attributed ledger

**Days 15–25 · Fill the gaps**
- Process candidate replies as they arrive — this is the labour bottleneck, not code
- Issues pages with evidence
- Parse the budget book for the service-area breakdown
- Attend/watch all-candidates meetings; quote from them

**Days 26–35 · Election readiness**
- Live wait-time integration, tested under load
- Static fallback for everything — assume the ArcGIS endpoints get slow on the day
- Cache headers, load test, accessibility pass
- "How to vote" prominence increases as the date closes

**26 October · Election day**
- Wait times live, everything else static and cached

**27 October onward · Phase B**
- Results, ward by ward, against 2018 poll-level baselines
- Switch the site's job from "help me vote" to "here is what they promised"
- Early 2027: campaign finance filings land. Publish contributor totals for all 86.

---

## 7. Decisions I need from you

1. **Scope.** Phase A first, shipped in ~10 days? Or build the full portal and accept
   it lands after the vote? (Strong recommendation: Phase A.)
2. **Stack.** Next.js static + Python ETL as above, or do you want something else?
3. **Candidate outreach.** 86 emails plus reply handling is the real bottleneck and it
   is not a coding task. Are you doing it, or does the site ship with mostly empty
   position slots and say so?
4. **Domain.**
5. **The Clerk question.** Do you want to make that call, or should I draft the email?

## 8. Open items
- Open data licence — unconfirmed
- City / Region / education split of the tax bill — not on the City budget page, needs sourcing
- 2021 census population — needs a primary citation before publishing a number
- Housing starts figures — reported, need primary citation
- Candidate counts differ slightly between Wikipedia and the City list; **the City list wins**
- Taran Chahal (City Cllr, wards 7+8) was certified 25 Aug by Ontario Superior Court
  order — note it on his profile, do not bury it
