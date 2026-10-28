# Third-Party Notices

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
