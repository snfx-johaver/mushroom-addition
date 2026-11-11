# Security and privacy

Report suspected vulnerabilities privately through GitHub's security reporting
feature when available. Do not include credentials, dashboard exports, household
identifiers, precise locations or screenshots containing personal information in
public issues or pull requests.

Use fictional entity names and synthetic data in documentation and demos. Keep
live Home Assistant audit exports and screenshots outside the repository.
`npm run check:privacy` checks tracked text, including release bundles and source
maps, for private deployment addresses and user paths, and rejects live audit
JSON exports. CI also runs Gitleaks. These checks are safeguards, not proof that
all personal data or secrets have been detected; review assets manually.

Release workflow actions are pinned to immutable commit revisions. Review
upstream changes before updating these pins.

## Historical audit artifacts

Older commits contain now-deleted live audit JSON files with an internal Home
Assistant address and household entity identifiers. Removing those files from
the current tree did not remove historical copies. No live credentials were
identified in the targeted review. The 0.10.0 release does not rewrite published
history; a complete purge requires a separately approved, coordinated history
rewrite and may require GitHub support to remove cached and pull-request copies.
Forks and existing clones cannot be recalled. Rotate any credentials if further
investigation identifies an actual credential leak.
