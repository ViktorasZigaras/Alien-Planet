# Alien Planet

A small, intentionally provisional turn-based planetary settlement sandbox for Viktoras. This is a place to play with ideas, not a balanced strategy game.

## Play

Build the standalone file with Python (standard library only):

```sh
python3 build.py
```

Then open `index.html` in a browser. Playing requires no installation, server, account, or network connection. A ready-to-play build is also available in the ChatGPT project files as `Alien_Planet_v0.1.html`. The generated starter roster is embedded in the HTML. Its crops retain their original backgrounds; the artwork is only a temporary insert.

Start at Main Base. Change jobs using each cohort's dropdown. End Turn produces resources. Develop Technical Education to train Workers; develop Standard Tooling to build. Set a Worker to Idle, choose Select builder, and select a clear nearby hex to construct a district. Select the completed district to construct its Workshop, then assign someone to the Workshop at the owning settlement.

Use the Mobile units list to select a unit. Select a map destination and press Move here. Selecting a different occupied map hex while a unit is selected keeps the current unit and targets that hex; use the units list to switch units explicitly. Mobilised population has no movement until the next turn. Field Coordination extends its supply range enough to reach Field Station. Join the station and assign its laboratory job.

Export Save downloads a JSON checkpoint. Import validates it before replacing the current state. Reset restores the starting expedition.

## Small first slice

- 9 × 7 fixed axial hex board, two existing settlement sites.
- Four persistent population cohorts, one rover, three qualifications.
- Five pooled resources and separate technical/social capabilities.
- Tile and building employment, training, construction and relocation.
- One Production District and Workshop per settlement; one faction construction slot and one training slot.
- Terrain movement costs and class-specific supply boundaries.
- Save import/export, reset, forecasts and turn reports.

No AI opponent, combat, growth, diplomacy, shipping simulation, research queue, content editor or victory condition.

## Modify

Edit `src/game.html`. Its first `<script>` contains the simulation; the second contains the DOM/SVG interface. Run `python3 build.py` after editing. `PRESET` and `NODES` hold provisional settings and capability definitions. Commands validate before changing the serialisable state. UI selection is separate from game state. Cohorts retain their IDs when training or moving.

This deliberately remains one file. There is no framework or dependency manager. The tiny build script only reinserts the original starter image into the HTML. The image is stored as numbered base64 chunks to stay within the GitHub connection’s upload size limit. The embedded art is comparatively large; asset cleanup can wait until its visual role is clearer.

## Check

With Node.js installed:

```sh
python3 build.py
node test.cjs
```

The test extracts and runs the actual engine from `index.html`. It checks the brief's exact resource walkthrough, project timing, empty facilities, cohort identity, supply, movement, atomic failures, save validation and shortage recovery. It does not search for an optimal strategy.

Browser checks also covered map/unit selection, training, job changes, development, building and staffing the Workshop. See `VALIDATION.md` for the completed browser coverage.

## Design source

Based on `Planetary_Strategy_Codex_Development_Brief.md`, read from the user's Generated Games folder on 29 October 2026. Generated roster: `Pixel-Art Sci-Fi Strategy Roster.png`. Names, yields and numbers are demo defaults, not permanent design commitments.
