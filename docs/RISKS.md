# Open risks — resolve before launch

## 1. Third-party advertising registration — BLOCKING
Ontario's *Municipal Elections Act* requires third-party advertisers that promote
or oppose a candidate to register with the City Clerk, with spending limits and
filing obligations. An informational site should sit outside that, but the line is
not one to guess at.

The City publishes its own guidance: brampton.ca → Election → Third Party Advertisers
("What is Third Party Advertising?", "Who Can be a Registered Third Party?").

**Action:** ask the Clerk's election office directly whether this site needs to
register, and get the answer in writing. This is the strongest argument for the
no-endorsements / no-scores rule.

## 2. Open data licence — unconfirmed
geohub.brampton.ca's terms page loads but no licence text could be extracted.
Until confirmed: link and attribute, cache for performance, do **not** mirror
datasets wholesale or present them as our own. Most Ontario municipalities use an
Open Government Licence that permits this, so it is likely a formality — verify it.

## 3. Do not look official
The site must never be mistaken for the City. Held by: distinct branding, a
standing "not the City of Brampton" line under the masthead, and a disclaimer in
every footer. Note the City's own election URL is brampton.ca/bramptonvotes — so
avoid any name close to "Brampton Votes".

## 4. Defamation
Real candidates, weeks before a vote. The quote-attribute-link discipline in
SOURCING.md is the defence. No characterisation, no inference, right of reply logged.

## 5. Candidate photos
The City publishes headshots for *sitting* councillors only. For the challengers
there is no photo we have rights to. Use an initials monogram — do not scrape
social media.

## 6. Privacy
Ward lookup runs entirely in the browser (point-in-polygon against the shipped
ward polygons). No address or coordinate is ever sent to a server, and nothing is
logged. Keep it that way.
