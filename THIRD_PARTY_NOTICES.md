# Third-Party Notices

## Car Advanced vehicle engine (MIT)

`src/car-advanced/vendor/vehicle-engine.js` incorporates Vehicle Status Card
v1.26.1 from https://github.com/ngocjohn/vehicle-status-card.
Copyright (c) 2024 Viet Ngoc. The complete MIT license is preserved in
`src/car-advanced/vendor/LICENSE` and included in the distributed bundle.

Adaptations: private component and event namespaces, lazy initialization,
Car Advanced registration, shared Mushroom presentation and actions, and
embedded visual configuration panels in the standard editor sections.
The vehicle engine is bundled; the original frontend resource is not required.
Its optional MapTiler engine and RTL text plugin are also bundled privately.
Their complete notices are preserved in
`src/car-advanced/vendor/LICENSE-EXTRA-MAP` and
`src/car-advanced/vendor/LICENSE-RTL` and included in the distribution banner.

## Animated weather (MIT)

`src/weather-advanced/` incorporates Dynamic Weather Card from
https://github.com/teuchezh/dynamic-weather-card, revision
`df336a0211b9d421d0f6e18741861b806a22d983`.
Copyright (c) 2026 Teuchezh Nurbiy. The complete MIT license is preserved
in `licenses/Dynamic-weather-LICENSE` and included in the distributed bundle.

Adaptations: Weather Advanced registration and namespaced internal components,
shared Mushroom heading and actions, lazy visual editor controls, container-aware
layout, per-instance localization, relevant-entity updates, bounded forecast
subscription retries and animation lifecycle/performance safeguards.

## Energy planning and entity workflow cards (MIT)

`src/energy-cards/` and `tests/energy-cards/` incorporate MIT-licensed energy
cards from Mushroom Addition Energy Cards. Copyright (c) 2026 Mushroom Cards
Addition contributors. The complete license is preserved in
`licenses/Energy-cards-LICENSE` and included in the production bundle.

Adaptations: canonical Smart Saving and Energy Entityworkflow registration,
shared Mushroom presentation and interactions, lazy shared editor integration,
and consolidated types, localization, and picker metadata.

## NAS dashboard cards (Apache-2.0)

`src/nas/` and the upstream-derived fixtures/tests in `tests/nas/` incorporate
SNFX Synology Cards, revision `424ca74597e2e68d8320e8be4ba15651f838a8c8`
(v3.1.0), from https://github.com/snfx-johaver/SNFX-Synology-cards.
That frontend was adapted from https://github.com/ruaan-deysel/ha-unraid,
revision `c816d9fd113df51c66ffde050a8dba52c799b2e1`.

Copyright 2025 Domalab.

These files remain under the Apache License, Version 2.0, not the project's
MIT license. The complete upstream license and unaltered NOTICE are preserved in
`licenses/SNFX-Synology-cards-LICENSE` and
`licenses/SNFX-Synology-cards-NOTICE`.

Mushroom Addition modifications: consolidated single-bundle registration,
Mushroom Addition card and editor namespaces, hidden Synology/SNFX aliases,
canonical embedded dashboard children, catalog metadata and integration tests.
NAS discovery, entity mappings, display settings and controls are retained.
Modified upstream files carry a change notice.

This project is not affiliated with Synology, Unraid, QNAP or Portainer.

## Bundled dependencies

- Lit: BSD-3-Clause; copyright 2017 Google LLC. Full license:
  `licenses/Lit-LICENSE`.
- Material Design Icons (`@mdi/js`): Pictogrammers Free License (icons:
  Apache-2.0; code: MIT). Full notice:
  `licenses/Material-Design-Icons-LICENSE`.

The production JavaScript banner includes these notices and full license texts,
so standalone HACS/release downloads retain the required attribution.

## MIT-licensed portions

The optional `custom_components/mushroom_addition_market/` backend is original
MIT-licensed code. It uses [yfinance](https://github.com/ranaroussi/yfinance)
(Apache-2.0) as an installed Python dependency, not bundled source. It is not
affiliated with or endorsed by Yahoo. Yahoo's data terms apply; this feature
is intended for personal use, not investment advice or data redistribution.

Licensed under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
