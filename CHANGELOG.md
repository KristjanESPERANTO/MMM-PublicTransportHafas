# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [4.5.2](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.5.1...v4.5.2) (2026-08-31)

### Fixed

* **query:** avoid blocked DB profiles ([ef80b69](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/ef80b69e936575cc1efd5960b3bc2a4400f68014))

### Documentation

* recommend MMM-PublicTransportHub ([0599301](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/05993013c765bf21f28337507f57f861ad557465))

### Chores

* update devDependencies ([70f8e15](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/70f8e150be4c2fdbc7d100c0425ca2e9ca09ce0d))
## [4.5.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.5.0...v4.5.1) (2026-08-16)

### Fixed

* clarify DB blocked fetch errors ([d9d83d5](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d9d83d57a5eae6897fd6494979dff11125678661))

### Chores

* add allowScripts config ([cb3a717](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/cb3a71795cb807341484f5346f962ac4d951e874))
* update dependencies ([0356a0c](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/0356a0ca103b166e0bac6fc41c2bfbebc8028b9a))
* update GitHub Actions ([7f85691](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/7f85691e5db2105a9f228d171585bfb5f67d549a))
## [4.5.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.4.4...v4.5.0) (2026-07-10)


### Added

* **fetcher:** add retry handling for transient HAFAS fetch errors ([512c845](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/512c8450e15db0c7d4eff73d298256feee6dca12))
* wire fetchRetries config ([5672b5f](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/5672b5f4c1664083a1066dcc09fa3770479b3149))


### Fixed

* update temporal-polyfill script path to global.js ([5ba4813](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/5ba4813f8ff77b6bf7519b55640ab289d9c4cb8c))


### Chores

* update dependencies ([99d8e61](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/99d8e61b866ab658698b4c7c2805bc5a738cb1eb))
* update node engine requirement to >=22 ([e484bbc](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/e484bbcaeccf9275c087d4cb93722511cc52bd82))


### Code Refactoring

* trim temporal runtime hooks ([b7765de](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/b7765deb8f75a0f9e5df61d429fd545908930f1c))


### Tests

* clean up noisy rejection logging in bug-fixes tests ([03fc6fc](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/03fc6fca61d9e97a4838f7c8e3defb51b05361ef))
* cover fetchRetries sanitization ([56b3e06](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/56b3e068cf621666c5d3cf12de2c445dffc99e6f))

## [4.4.4](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.4.3...v4.4.4) (2026-07-05)


### Chores

* update dependencies ([5cc1284](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/5cc1284a7cd8a4d4c23c273706297ce838f9cee9))
* update github actions ([6037e4d](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/6037e4dd55b201414dce2a0337d016a5da9c0113))

## [4.4.3](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.4.2...v4.4.3) (2026-05-23)


### Fixed

* **query:** use dbweb profile for db/dbweb station search ([bb154cc](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/bb154ccde7f3fdb6f279b3351a1b3e49f4f60d84))


### Chores

* cleanup demo config ([1585c23](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/1585c238c8a5d2703e592ffa66f3dcb44bcb3efe))
* dependencies ([0d7c3ae](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/0d7c3ae8c794f729bc7c89be3137bb7406da0308))

## [4.4.2](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.4.1...v4.4.2) (2026-05-19)


### Documentation

* remove broken dbweb recommendation from direction filter note ([487cc4a](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/487cc4aabbaf1b3f67f5ea16884592136ac644ba))


### Chores

* remove copilot instructions file ([327168b](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/327168bbc9bd9e72eb675a27e6909f66f27396c9))
* update dependencies ([299a510](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/299a510df19f96b7bd1a02cd2f5c3472a80bb7e8))

## [4.4.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.4.0...v4.4.1) (2026-05-07)


### Fixed

* **css:** prevent wrapping in departure time column when destination is long ([b8262f7](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/b8262f76cfcce100419f36ad325d5d2015cc91a2))


### Chores

* update dependencies ([dd644d8](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/dd644d8939b376aa1598d8db6249453412072afa))

## [4.4.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.3.1...v4.4.0) (2026-04-15)


### Added

* **warning-remarks:** constant scroll speed regardless of text length ([cab6ac5](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/cab6ac550b0a2674fcf51275318cbb595b27904c)), closes [#102](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/102)


### Fixed

* **warning-remarks:** prevent table width expansion ([0b645a7](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/0b645a7366aa82697410a6dad5f96362f9753bdf)), closes [#270](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/270)


### Chores

* update devDependencies ([a4acecb](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/a4acecb4ad9de386e4274bcfbf489c04ab9fb2cc))

## [4.3.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.3.0...v4.3.1) (2026-03-30)


### Chores

* add "busx" to custom words list ([d9a3745](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d9a3745b5b4c419d021c42269d6c89135c85945b))
* streamline automated tests workflow ([5bf9ad9](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/5bf9ad99f3f032587a0101c020dd9b106f7d89d0))


### Code Refactoring

* replace lazy logger initialization with direct logger usage ([6326453](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/63264532eea4c06fb8db1b43a7f8ed0584c37e60))


### Tests

* stabilize flaky Temporal boundary assertions in DepartureFetcher tests ([2f21278](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/2f21278045e2bdb97a357cebfee015b4c97e0eda))

## [4.3.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.2.0...v4.3.0) (2026-03-30)


### Added

* add styles for new bus lines and update existing styles ([fad084e](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/fad084efdabe8c26ac28d53893f4b8098f974232))


### Fixed

* **node_helper:** use MagicMirror core module aliases for logger and node_helper ([9565072](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/956507250edb845b2511f3914acab7623da46b5c))


### Chores

* change var to const for config in demo.config.js ([8f73f01](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/8f73f01b2408a89c8b7df5a7fe1f7b208c1b1356))
* simplify prepare script ([d91a1e0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d91a1e097cf6973f9a76e504fd68b51e47c08496))
* update dependencies ([7b77063](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/7b77063509e0d86c06fefc3f0b81f24a217914f2))

## [4.2.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.1.1...v4.2.0) (2026-02-21)


### Added

* add toggleAbsoluteTimeInterval option to alternate time display ([ca60b56](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/ca60b56ca4b72b28a0dcb27a065e4f5ba95df114)), closes [#15](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/15)


### Chores

* update demo script ([9122b9d](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/9122b9db184f5bbbe31c1963586ca577e3277dbb))
* update devDependencies ([60ad128](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/60ad128c0621f148ee0b9b228b0d54e9a4eb3754))
* update ESLint config ([b587adf](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/b587adfc8dc925a2965b762f33417eed4a7bc9f5))

## [4.1.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.1.0...v4.1.1) (2026-01-12)


### Fixed

* handle null values and HAFAS API format changes ([ada88b2](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/ada88b25c53b66d6b1b1f1578d10aff9f0098b7f))
* use globalThis.Log to avoid top-level await ([8237330](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/823733038cf1f6a25f5fe2fa9ae71111f00f6672))


### Chores

* add unit tests step to automated tests workflow ([d3448f0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d3448f07f5e6ed4d6f415966730845ada6aecb9d))
* add vbn demo example ([131c8c1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/131c8c181c906459f10e78e582679f62dcdac4fc))
* update dependencies ([5de7202](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/5de72026ea3493771c2af9e216fe4ef3d3bd84a4))


### Code Refactoring

* simplify time assignment logic in getCell method ([ea012dd](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/ea012dd3ed3e1370c4dd1a1dfd529ae975bb6205))

## [4.1.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v4.0.0...v4.1.0) (2026-01-09)


### Added

* add platformsToShow filter option ([cb5179a](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/cb5179aba65fe77c18b5525107d06de6cd014521)), closes [#21](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/21)


### Chores

* update devDependencies ([2850378](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/2850378dab2150b9007bab8cdc217f6d35b59c25))


### Code Refactoring

* replace temporal-kit with temporal-polyfill ([967472b](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/967472bb5ae909a21c14bfea6c5769c15fc140d6))

## [4.0.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.5.2...v4.0.0) (2026-01-09)


### ⚠ BREAKING CHANGES

* migrate from dayjs to Temporal API

### Added

* migrate from dayjs to Temporal API ([a8772ec](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/a8772ecfe1b87a406342bb26c2e45b3fe82e4947)), closes [#253](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/253)
* modify direction filter to handle multiple IDs ([#253](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/253)) ([37e01cf](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/37e01cf9eb1bcd3a8ee857c0ec44acb6a1c9a31f))


### Documentation

* add release command to README ([a4adb7f](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/a4adb7fa2ad2f3649ffc24586b00b5beec76d8fe))


### Chores

* change runner from ubuntu-latest to ubuntu-slim in workflow files ([da29b49](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/da29b49a7904c3f83acdad289f54ace662ef0981))
* handle spelling issues ([50033b7](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/50033b702a117ca7eaaf5cedd5d33a635097998f))
* update actions/checkout to v6 in workflow files ([57361aa](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/57361aa2dd3cb1f8ed58eb473bd5bf271e723c70))
* update devDependencies ([24546b9](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/24546b9d6e0804898893e9e3ca9ab453cbc425c7))


### Code Refactoring

* convert DOM builders to ESM modules ([be58162](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/be58162f44c98b8352a015ff0e504356e30e7001))
* extract config validation into testable module ([3cb19e1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/3cb19e182c848c386dcec5f5e51476bc705c3872))
* improve robustness of multi-direction feature ([971d086](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/971d086760791a9975c8bf8983fc6932d147df1e))
* move excludeDirections filter to backend ([8566aa3](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/8566aa35ad3d18067d04f91435928c34e5c4d413))


### Tests

* add time calculation and reachability tests ([7794aaf](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/7794aafc979156aef4a28e40d58167b0b4fe5ce3))
* add unit tests using node:test ([9420064](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/942006492041232c2db1e1d82eff541095a0c0c3))

## [3.5.2](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.5.1...v3.5.2) (2026-01-01)

### Chores

- add demo config and demo script ([1cd4a56](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/1cd4a56e4de19a2eaa11404d318df101c0d8f5cb))
- **changelog:** change section label for chore type ([9ba98b6](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/9ba98b6d8b87e15b588e3b10d0f62e88b7bc9825))
- fix contributors section in package.json ([39e4890](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/39e4890bc37a1827e01c01b92e73513a6cdf3a42))
- make simple-git-hooks more robust and platform independent ([679cc27](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/679cc2768b9e51761cac22764ea445448f6b0db2))
- update dependencies ([41265f7](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/41265f7d17cf19faeab8ec21ed0a3e4cec16b6db))

### Code Refactoring

- improve log message formatting ([ab655ad](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/ab655ad0cb5cf98d6419d558678008b801a6d6bd))
- optimize DOM builder initialization ([74448b6](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/74448b68c1a41ba213ade45805e444b9a295b386))
- remove module prefix from log messages ([8118f16](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/8118f16537787e5fbe3a770c2a3442f5e83ce324))
- simplify departure filtering logic ([fb6f531](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/fb6f5313d8249f5b92626cc70c04a579152a116a))

## [3.5.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.5.0...v3.5.1) (2025-11-30)

### Documentation

- replace not working sbb profile with working one for query script ([695e2e1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/695e2e1214a6d3adcace1667b9b7583cfa2562ce))

### Changed

- **ci:** add release script and changelog configuration ([49f3c7b](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/49f3c7b8fe8e8b70ca7cedd06e5767804ebc1b29))
- update dependencies ([459bf86](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/459bf86930a44e9332d0b10add9d829889fbb36f))
- update Node.js action to v6 in automated tests workflow ([7684fdc](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/7684fdce152fc82f2e6fe95f511474943362f9e3))

## [3.5.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.4.0...v3.5.0) 2025-10-17

### Changed

- chore: replace `husky` with `simple-git-hooks` for pre-commit linting
- chore: update devDependencies
- docs: update installation instructions to include `--ignore-scripts` option for `npm ci`

### Fixed

- fix: improve module initialization and error resilience

## [3.4.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.3.0...v3.4.0) 2025-10-14

### Added

- feat: add `excludeDirections` option to filter out departures to specific destinations (#236) - thanks to @Tmist3r
- feat: add css style for lines in Graz

### Changed

- chore: update devDependencies

## [3.3.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.2.1...v3.3.0) 2025-10-12

### Added

- feat: add socket error threshold to improve resilience against temporary network issues (relates to #186)

### Changed

- chore: update actions/setup-node to v5 in automated tests workflow
- chore: update dependencies

### Fixed

- chore: add Prettier configuration file for code formatting - disable embedded language formatting to avoid issues with code blocks in markdown files.

## [3.2.1](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.2.0...v3.2.1) 2025-08-27

### Changed

- chore: update actions/checkout to v5 in workflow files
- chore: update dependencies

### Fixed

- chore: fix typos

## [3.2.0](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.12...v3.2.0) 2025-07-25

### Added

- feat: add `hannover-lines.css`

### Changed

- chore: remove useless `global` and format import statement in `DepartureFetcher.mjs`
- chore: update dependencies
- chore: update husky prepare script to handle missing installation gracefully

## [3.1.12](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.11...v3.1.12) 2025-07-01 - Maintenance Release

### Changed

- chore: add `type` field to `package.json`
- chore: update dependencies

## [3.1.11](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.10...v3.1.11) 2025-05-05 - Maintenance Release

### Changed

- chore: simplify linting setup by removing `stylelint` and `markdownlint`
- chore: simplify ESLint config by applying same rules to `*.js` and `*.mjs` files
- chore: update `cspell`
- chore: reduce timeout for lint job from 30 to 10 minutes

## [3.1.10](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.9...v3.1.10) 2025-05-03

### Changed

- chore: fix ESLint config to ignore unresolved imports
- chore: refactor ESLint config to use `defineConfig` and add `@eslint/css`
- chore: update devDependencies

## Fixed

- fix: set `requiresVersion` to `2.31.0` since last release doesn't work with older MagicMirror versions

## [3.1.9](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.8...v3.1.9) 2025-04-30 - Maintenance Release

### Changed

- chore: update `npm ci` command to omit dev dependencies
- chore: use `node --run` instead of `npm run` to run scripts
- chore: drop node 18 support
- chore: update devDependencies
- chore: adapt and apply linter rules
- refactor: switch `DepartureFetcher` to ESM - this is a start of the migration to ESM.
- refactor: use paths to not rely on `module-alias` in core

## [3.1.8](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.7...v3.1.8) 2025-04-21 - Maintenance Release

### Changed

- chore: clean up ESLint rules by removing unnecessary settings and improving consistency
- chore: update dependencies
- docs: add npm install command to developer commands section

## [3.1.7](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.6...v3.1.7) 2025-04-11 - Maintenance Release

### Changed

- chore: update dependencies
- chore: update ESLint configuration to use new import plugin structure
- chore: enable ESLint rule

## [3.1.6](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.5...v3.1.6) 2025-03-23 - Maintenance Release

### Changed

- chore: Update dependencies
- chore: Update eslint-plugin-package-json config

## [3.1.5](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.4...v3.1.5) 2025-03-11 - Maintenance Release

### Changed

- chore: Update dependencies
- chore: Remove old release script from list
- chore: Simplify stylelint-prettier config
- chore: Nest all CSS in module class

## [3.1.4] 2025-03-02 - Maintenance Release

### Changed

- chore: Update dependencies
- chore: Switch to default config of package-json

## [3.1.3] 2025-02-27 - Maintenance Release

### Added

- Add information for using `dbweb` profile in query_stations script.

### Changed

- Drop node 16 support (It reached EOL 2023. And `db-vendo-client` will drop it with the next release too.)
- Update README to clarify `direction` option limitations with dbweb profile
- chore: Replace eslint-plugin-import by eslint-plugin-import-x
- chore: Update devDependencies
- chore: Remove release script (not needed anymore)
- chore: Optimize lint-staged
- chore: Optimize @stylistic/eslint-plugin config

## [3.1.2] 2025-02-17

### Fixed

- Fix direction issue with `db` profile (#193). Users who need this option should use the new `dbweb` profile instead.

### Changed

- chore: Update dependencies

### Removed

- Removed the workaround (introduced in 3.0.2) to attempt to fix the direction issue with the `db` profile. This workaround is not needed anymore.

## [3.1.1] 2025-02-01 - Maintenance Release

### Changed

- chore: Update dependencies
- chore: Fix spelling
- chore: Extend `release` script with test
- Add hint about issue with direction option `db` profile

## [3.1.0] 2025-01-18

### Added

- Add new options `warningRemarksFilter` and `showWarningsOnce` to filter departure warnings (#194) - by @drtorchwood.

## [3.0.2] 2025-01-14

### Fixed

- Fix direction option `db` profile.
  The direction option is not yet supported by the `db-vendo-client`. This is a workaround to make it work again. When the `db-vendo-client` supports the direction option, this workaround will be removed.

## [3.0.1] 2025-01-12

### Fixed

- Round delay to one digit after comma

## [3.0.0] 2025-01-11

Usually a major release would contain breaking changes. But in this case, the changes are not breaking changes for the user. The major release is due to the fact that the underlying `hafas-client` library is not been used for the `db` profile anymore. Instead, the `db-vendo-client` is used. This is a major change in the codebase, but the user should not notice any difference.

### Changed

- Use `db-vendo-client` instead of `hafas-client` for `db` profile
- chore: Update devDependencies
- chore: Improve error logging in query_stations

## [2.1.13] 2024-12-17

### Changed

- chore: Enable rule "markdown/no-missing-label-refs"
- chore: Update dependencies incl. hafas-client

## [2.1.12] 2024-12-16

### Changed

- Only show the error message if it occurs 2 times in a row.
- chore: Update devDependencies

## [2.1.11] 2024-12-14

### Changed

- Optimize logging
- chore: Update devDependencies
- chore: Optimize heading in README.md
- chore: Switch to lts node version in linter workflow

## [2.1.10] 2024-12-10 - Maintenance Release

### Added

- chore: Add CHANGELOG.md

### Changed

- chore: Update Code of Conduct
- chore: Update devDependencies
- chore: Update format `package.json`

## [2.0.4 - 2.1.9] Maintenance Releases

There were several maintenance releases in this period. The changes are not listed here, but you can find them in the commits.

## [2.0.4] 2023-11-22 - Maintenance Release

### Changed

No functional changes. Just optimizations to the linting process and dependency updates.

## [2.0.3] 2023-11-22 - Maintenance Release

### Changed

No functional changes. Just optimizations to the code and dependencies updates.

## [2.0.1] 2023-01-22

### Changed

- Optimize remark animation in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/126> - by @ucfnet002
- [Don't do line breaks in line symbols](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/4be2dfb42fe4628eec4cab19d61ceaf1d98430af)
- [Update and add line colors for Düsseldorf](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/236d7c3a6e7599e0e9e6554af14d4d72cccf8672)
- Update dependencies

## [2.0.0] 2022-12-17

### Changed

- [Update hafas-client to 6.x](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/b279a62767667d416a48463e640590d02ea97def)
  - minimal node version is now 16
- translate query_stations script to english
- refactor

## [1.5.4] 2022-11-27

### Changed

- Optimize error handling
- Update dependencies

## [1.5.3] - 2022-09-21

### Changed

- Update CSS
  - [Set text-align for direction cell](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/81c34c40de8608299f82c154c5cffd15f52d8459) - Thanks to @djzwerg for the hint.
- Update dependencies
  - [Bump stylelint version](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/679de3eddb7aa85d12dde5a2b4d485385508810c)

## [1.5.2] - 2022-08-29

### Changed

- Update CSS for Düsseldorf 36388d91f844128214f68fbbd09ab717b4c4ba45 from [0m4r's fork](https://github.com/0m4r/MMM-PublicTransportHafas) - Thanks to @0m4r.
- New CSS file for Hamburg to solve #82
- Update Dependencies

## [1.5.1] - 2022-03-09

### Changed

- Replace Moment.js by Day.js in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/44>
- Add parameter showRelativeTimeOnlyUnder in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/45>
- [Add Super-Linter](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/4ea4fb01877a86da97fe8e3009e89d5ea64965e7) and handle a bunch of linter issues

## [1.4.0] - 2022-02-03

### Changed

- Use kebab-case for class names **- this could be break custom CSS -**
- Add CSS file for Magdeburg
- Use `stylelint` for css files

## [1.3.0] - 2022-02-02

### Changed

- Add configuration option `ignoreRelatedStations` in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/8506c22151bee8fcac691a480101f5014a265922>
- Show "platform" as default in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/cc6cda9d9037fc5f3daa92ecb2fe49c0cbf39737>
- Optimize configuration part in README
- Remove dependency from "arr-diff" and "array-unique"
- Add a GitHub Actions CI workflow in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/32>
- Bump eslint from 8.7.0 to 8.8.0 in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/33>

## [1.2.0] - 2022-01-24

### Changed

- Introduction of eslint
- Code modification in context with eslint

## [1.1.3] - 2022-01-15

### Changed

- create berlin lines by @mazim-co in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/30>
- dynamic lead time adjustment to fix <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/issues/29>
- and some small other adjustments

## [1.1.2] - 2021-12-26

### Changed

_Skipped version 1.1.1 because 0m4rs fork had this version already._

- This is mainly a maintenance release (cleanup, linting, version bumping, ...) @KristjanESPERANTO
- Add tests from @0m4r's fork <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/26>

## [1.1.0] - 2021-12-06

### Changed

- Add row for warnings <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/1509e0d66a4c24018e377e9a2ec01844262d3c61>
- Cleanup

## [1.0.9] - 2021-11-16

### Changed

- Made animation speed configurable by @jrettsch in <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/pull/17>
- Add `hafasProfile` as config parameter <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/4c9f53a7a2ee65538a49c96bd2985c23c085a3a1>
- Add technical background details <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/69694e6754a116d21fbbb64eaf8e758b425779aa>
- Switch from var to let <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d560b7217a028b3819ca324f81465929f29e08ce>
- Add a function to mark canceled departures <https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/d954bd77ac79cedfcec07cbb285ef41a7be68d68>
- and much little changes more

## [1.0.8] - 2021-03-22

### Changed

1. Create `munich-lines.css` [1](https://github.com/raywo/MMM-PublicTransportHafas/issues/64), [2](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/adcc1ff5d9f80ffff7587166e41dc9ef92546039) - @moejetz
2. Introduce default classes for suburban and subway [3](https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/commit/8994273a1af5bde96b93e7cad76752bc440381f7)
3. Bunch of minor changes

## [1.0.7] - 2021-03-18

### Changed

1. Bugfix: Add missing comma #8
2. Cleanup: Change repo for installing #7

## [1.0.6] - 2021-03-17

### Changed

This is the first release of this fork. This merged all forks.

1. Update hafas-client #1 - @0m4r
2. Add CSS file for Düsseldorf #2 - @0m4r
3. Handle invalid departure times and canceled trains #3 - @rudibarani
4. Broadcast context #4 - @nkucza
5. Stopping update in some cases + display last update time #5 - @AgP42
6. Introduce platform column #6 - @KristjanESPERANTO
7. Add CSS file for Halle #6 - @KristjanESPERANTO

<https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/releases>

[3.1.4]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.2...v3.1.3
[3.1.2]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.1...v3.1.2
[3.1.1]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.1.0...v3.1.1
[3.1.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.0.2...v3.1.0
[3.0.2]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v2.1.13...v3.0.0
[2.1.13]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v2.1.12...v2.1.13
[2.1.12]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v2.1.11...v2.1.12
[2.1.11]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v2.1.10...v2.1.11
[2.1.10]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v2.1.9...v2.1.10
[2.0.4 - 2.1.9]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.2.0.4...v2.1.9
[2.0.4]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.2.0.3...v.2.0.4
[2.0.3]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.2.0.1...v.2.0.3
[2.0.1]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.2.0.0...v.2.0.1
[2.0.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.1.5.4...v.2.0.0
[1.5.4]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v.1.5.3...v.1.5.4
[1.5.3]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.5.2...v.1.5.3
[1.5.2]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.4.0...v1.5.1
[1.4.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.0.9...v1.1.0
[1.0.9]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/KristjanESPERANTO/MMM-PublicTransportHafas/compare/v1.0.5...v1.0.6
