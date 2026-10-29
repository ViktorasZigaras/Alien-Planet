# First-build checks

- `node test.cjs`: 134 assertions passed.
- Exact scripted economy through turn 10: Food 21, Industry 10, Credits 23, Research 13, Influence 8.
- Browser: loaded the actual standalone HTML through the preview server; selected tiles and rover; moved the rover; developed Technical Education; trained Cohort C; reassigned it to the lab; developed Standard Tooling and Field Coordination; built a district, built a Workshop, staffed it, and advanced to the exact turn-10 stocks above.
- Browser testing caught and fixed SVG artwork extending map click targets. Interaction now targets hex polygons and unit circles.
- Browser testing caught and fixed selecting an occupied destination switching to the other unit. When a unit is selected, clicking another unit's map token selects its destination hex; the explicit mobile-unit list switches active units.
- Engine tests complete specialist relocation, station staffing, save round trips (including projects in progress), malformed-save rejection and shortage recovery.

No balancing, strategy optimisation or opponent behaviour was attempted. The art is a trial insert with visible original backgrounds. The main simulation and UI remain in one HTML file for now.
- Browser: completed Specialist mobilisation, four-step travel to Field Station, joining, laboratory assignment and subsequent production. The cohort remained Cohort C throughout.
