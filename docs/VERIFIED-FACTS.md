# Brampton portal — verified facts (checked 2026-09-20)

## THE DEADLINE (user said 2027 — actually 2026)
- Election day: **Monday, October 26, 2026** (Ontario: 4th Monday of October, every 4 years)
- Advance voting: **Oct 9, 10, 11, 16, 17, 2026** (from live city API)
- Nominations CLOSED Aug 21 2026, 2pm. Candidates CERTIFIED Aug 25 2026 (list is final)
- => 36 days to election day, 19 days to first advance poll

## Structure
- 10 wards, paired into 5 electoral areas: 1+5, 2+6, 3+4, 7+8, 9+10 (confirmed via ward API)
- Brampton City Council = 11 people: Mayor + 5 Regional Councillors + 5 City Councillors
- Each ward pair elects 1 Regional Councillor + 1 City Councillor
- A voter casts **4 votes**: Mayor, Regional Councillor, City Councillor, School Trustee
- Peel Regional Council = 25 (Chair + 24). Brampton has 9 seats: Mayor + 5 Regional Cllrs
  + 3 City Cllrs chosen by council after the election. (Mississauga 12, Caledon 3)
- Ward boundary review PAUSED — current boundaries stand for 2026
- Strong-mayor powers apply to the mayoralty

## Turnout
- 2022: under 25% of eligible voters. Ontario municipal average 2022: 32.9%

## Money (2026 budget)
- Operating: $1.0385B | Capital: $340.4M
- Approved: 0% increase on City portion + 1% levy for 2nd hospital reserve
  (proposed was 1.5%; final = 0% + 1% hospital)
- City tax per capita $1,516 vs GTA average $1,819
- Reserves: record $163M
- $125M city commitment to William Osler / Peel Memorial
- New hires: 24 firefighters, 14 fire prevention, 12 bylaw, 24 property standards
- NOTE: tax bill = City + Region of Peel + Education. Split NOT on city budget page — must source.

## Known issues (need per-issue sourcing before publishing)
- Healthcare: one full-service hospital for ~700k people; "hallway healthcare"; 2nd hospital in progress
- Housing: 1,831 starts in 2024; 1,138 in first 3 quarters of 2025 — far below provincial target
- Transit: has not kept pace with growth; car dependency
- Infrastructure deficit vs growth (schools, parks, policing, roads, water)

## WORKING APIs (all verified live, no key needed)
Brampton ArcGIS org: rl7ACuZkiFsmDA2g on services3.arcgis.com  (owner BramptonMaps)
Base: https://services3.arcgis.com/rl7ACuZkiFsmDA2g/arcgis/rest/services
Supports f=geojson natively. 516 services total.

| What | Service / layer | Fields |
|---|---|---|
| Ward polygons | Planning_Local_Government/FeatureServer/3 | WARD, ELECTORAL_AREA |
| Voting day places 2026 | 2026VotingDayLocations_PRD/0 | LOCATION_NAME, ADDRESS, FACILITY_TYPE, ACCESSIBLE, WARD |
| Advance polls 2026 | 2026AdvanceVotingLocations_PRD/0 | FACILITY_NAME, ADDRESS, WARD, WAIT_TIME, DATE_AND_TIME_1..5 |
| Poll subdivisions | Brampton_Elections/0 | POLL_ID, WARD, SUBDIVISION, LOCATION_NAME, ADDRESS |
| Current council | Term_of_Council_Elected_Officials_2022_to_2026/0 | names, role, email, phone, Photo_URL, Source_URL |
| 2018 results BY POLL | 2018_Election_Results/0 | Office, Candidate_Name, Voting_Location_ID, Number_of_Votes |
| Capital works | ParksConstructionProjects, Roadworks_Archive, BramptonWorks_OpenData | |
| Planning schedules | Brampton_Plan_Schedule_1A..12 | official plan layers |
| Census/demographics | Census_2021, Population_by_Age_and_Sex_2021, Enriched_Ward_Boundaries | |
| Other | Building_Permits_DEV, Transit_Stops_and_Routes, Active_Business_Licenses | |

Peel Region ArcGIS org: ONZht79c8QWuX759 on services6.arcgis.com (Peel_Ward_Boundary etc.)
Council agendas/minutes/votes: pub-brampton.escribemeetings.com (HTTP 200, filestream.ashx?DocumentId=N)
2022 official results PDF: brampton.ca/EN/City-Hall/election/Documents/2022 Brampton Municipal Election - Official Results.pdf
AMO 2022 results: elections2022.amo.on.ca/web/municipal/10108
Certified candidates: brampton.ca/EN/City-Hall/Election/Candidates/Pages/candidateListing.aspx

## OPEN ITEMS / RISKS
- Open data LICENCE not confirmed. geohub terms page returns 200 but no licence text extracted.
  MUST confirm before bulk re-publishing. Safe interim: link + attribute + cache, don't mirror wholesale.
- opendata.brampton.ca does NOT resolve (DNS fail). Use geohub.brampton.ca.
- Candidate platforms/positions NOT researched. Must be sourced per candidate, never inferred.
- Region of Peel vs City tax split needs sourcing.
- Candidate counts differ slightly between Wikipedia and the city list — city list is authoritative.
- Taran Chahal (City Cllr W7/8) certified Aug 25 2026 by Ontario Superior Court order.
