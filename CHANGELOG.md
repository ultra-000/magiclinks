# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased changes

<br/>

More technical details [here](https://github.com/ultra-000/magiclinks/compare/HEAD...HEAD)

<br/>

## [v2.5.0] - 2025-05-10

### Added
- Added support for watching new added directories/folders in watch mode ([commit](https://github.com/ultra-000/magiclinks/commit/3b5769ee7fed6cccc0970a3bdf131589aab618a3))

<br/>

## [v2.4.0] - 2025-04-22

### Added
- Added support for dynamic links resolving ([commit](https://github.com/ultra-000/magiclinks/commit/639ed1612890b709d734d555d6c990969c0b7ada))
- No quotes (or backticks) are needed anymore for surrounding placeholder links ([commit](https://github.com/ultra-000/magiclinks/commit/639ed1612890b709d734d555d6c990969c0b7ada))

<br/>

## [v2.3.1] - 2025-04-17

### Fixed
- Extracting incorrect files from globs like: `/*` ([commit](https://github.com/ultra-000/magiclinks/commit/d2635e865397015b0323530d006c55816037ebec))

<br/>

## [v2.3.0] - 2025-04-17

### Added
- Added an `-i` or `--init` option to quickly set up Magiclinks by creating a default `magiclinks.config.js` file in your current working directory ([commit](https://github.com/ultra-000/magiclinks/commit/0ddc5cad4c5ab1b4f85f48a63363b4b3c96825a2))
- Added a `-b` or `--build` option to process your project files using Magiclinks ([commit](https://github.com/ultra-000/magiclinks/commit/0ddc5cad4c5ab1b4f85f48a63363b4b3c96825a2))

### deprecated
- The bare `magiclinks` command without the `-b` or `--build` option will just print help in the future ([commit](https://github.com/ultra-000/magiclinks/commit/0ddc5cad4c5ab1b4f85f48a63363b4b3c96825a2))

<br/>

## [v2.2.0] - 2025-04-17

Mistake, wasn't meant to be published (again 🙃). ([commit](https://github.com/ultra-000/magiclinks/commit/8da67b9e9e38a3db0480d3c9b3f602759a74536a))

<br/>

## [v2.1.3] - 2025-04-15

### Fixed
- Fixed watch mode trying to delete non-existing files ([commit](https://github.com/ultra-000/magiclinks/commit/902d884442b946271ba3b0ea1671d24478982775))

<br/>

## [v2.1.2] - 2025-04-15

### Changed
- Used the `chokidar` library to ensure reliable files system watching ([commit](https://github.com/ultra-000/magiclinks/commit/58e32b5e8a9a70b846a1cc7e8309bb0b06a389dd))

<br/>

## [v2.1.1] - 2025-04-13

### Fixed
- Fixed watch mode not respecting files filtering, which made it includes all files extensions regradless of the extensions specified via the glob patterns (how did I let this slip through 🤦) ([commit](https://github.com/ultra-000/magiclinks/commit/774f8de371d703ac9e40d66f12b27654428ac388))

<br/>

## [v2.1.0] - 2025-04-13

### Added
- Added watch mode ([commit](https://github.com/ultra-000/magiclinks/commit/b95b1a031572f2fe60cb5d19a3b01ffd7cb534e1))

<br/>

## [v2.0.1] - 2025-04-11

### Changed
- Removed a duplicate line in README.md file ([commit](https://github.com/ultra-000/magiclinks/commit/ca468268234453bc15032856744e317f9a58a8e1))

<br/>

## [v2.0.0] - 2025-04-11

### Added
- Added support for specifying source directories and excluded directories via glob patterns ([commit](https://github.com/ultra-000/magiclinks/commit/d8c53d4b879e97247ecf7851f399664096c0f67f))

### Changed
- Changed the old way of specifying source directroies and excluded directories via bare paths ([commit](https://github.com/ultra-000/magiclinks/commit/d8c53d4b879e97247ecf7851f399664096c0f67f))

<br/>

## [v1.3.0] - 2025-04-11

Mistake, wasn't meant to be published. ([commit](https://github.com/ultra-000/magiclinks/commit/6a416c99fbee4481a276f37b884b28ef6b877c2f))

<br/>

## [v1.2.12] - 2025-04-09

### Added
- Added `CHANGELOG.md` file ([commit](https://github.com/ultra-000/magiclinks/commit/f352bc0e420a82f8a25765aa2e55f195f960bf27))

### Changed
- Updated `README.md` ([commit](https://github.com/ultra-000/magiclinks/commit/f352bc0e420a82f8a25765aa2e55f195f960bf27))

### Removed
- Removed unused `package-lock.json` ([commit](https://github.com/ultra-000/magiclinks/commit/f352bc0e420a82f8a25765aa2e55f195f960bf27))

<br/>

## [v1.2.11] - 2025-04-08

### Changed
- Updates to the `README.md` file ([commit](https://github.com/ultra-000/magiclinks/commit/589c9d8ab780648d153bc7d14647e9a57d069a47))

<br/>

## [v1.2.10] - 2025-04-07

### Changed
- Ensured predictability of the library ([commit](https://github.com/ultra-000/magiclinks/commit/0d7702215e9221a32ac06f667f877eb7f2060ef8))

<br/>

## [v1.2.9] - 2025-04-07

### Fixed
- Corrected validation logic for `dist_dir` property and corrected the config validation logic position in the execution timeline ([commit](https://github.com/ultra-000/magiclinks/commit/15ea375808bdd114ec3b7db85611f247386f36f1))

<br/>

## [v1.2.8] - 2025-04-07

### Fixed
- Adjusted the Regex pattern to account for preceding or following URL slashes ([commit](https://github.com/ultra-000/magiclinks/commit/4db7132b8f24e7e55b61df989627f2ab18d81260)) 

<br/>

## [v1.2.7] - 2025-04-07

### Fixed
- Fixed the logic for substituting placeholder links with real ones via a better Regex pattern that will avoid partial matches ([commit](https://github.com/ultra-000/magiclinks/commit/b4b9907137b72af5f8c3344a8878ef557061ca49))

<br/>

## [v1.2.6] - 2025-04-07

### Added
- New validation logic ([commit](https://github.com/ultra-000/magiclinks/commit/20cc4e06baebe95e261102e79a296c6a92ca0d75))

### Changed
- Refactored code and updated the `README.md` ([commit](https://github.com/ultra-000/magiclinks/commit/20cc4e06baebe95e261102e79a296c6a92ca0d75))

<br/>

## [v1.2.5] - 2025-04-07

### Fixed
- Fixed small bugs in `main.js` and ensured predictbility ([commit](https://github.com/ultra-000/magiclinks/commit/ddf99d80b9c8feac0394068f3f233074474a5350))

### Changed
- Updated the `README.md` file ([commit](https://github.com/ultra-000/magiclinks/commit/34fb574b1e151c5b4fdd323a9c4db64e0834c2fb))

<br/>

## [v1.2.4] - 2025-04-06

### Changed
- Code refactored, some adjustments and code readability improvements

<br/>

## [v1.2.3] - 2025-04-06

### Fixed
- Fixed `constants.js` to be Windows compatible ([commit](https://github.com/ultra-000/magiclinks/commit/76a56353348666291e81e4e8b3205f9521a707a8))

<br/>

## [v1.2.2] - 2025-04-06

### Fixed
- Fixed a compatiblity issue with Windows unable to load the config file ([commit](https://github.com/ultra-000/magiclinks/commit/692669874885ed5b381c64acc39c28d4788cac74))

<br/>

## [v1.2.1] - 2025-04-06

### Changed
- More details added to the `README.md` file ([commit](https://github.com/ultra-000/magiclinks/commit/6945179359735035c1c92f61c186385b42b512c9))

<br/>

## [v1.2.0] - 2025-04-06

### Fixed
- Fixed some minor bugs ([commit](https://github.com/ultra-000/magiclinks/commit/c58dad4039c634e6bca434dccd21c6cc3d6bd8f8))

### Changed
- Code refactored, some performance improvements ([commit](https://github.com/ultra-000/magiclinks/commit/c58dad4039c634e6bca434dccd21c6cc3d6bd8f8))
- Updated the `README.md` file ([commit](https://github.com/ultra-000/magiclinks/commit/a92a9e3293a475f40ff9118cf71857561d270d72))

<br/>

## [v1.1.1] - 2025-04-05

### Changed
- Additional metadata added to the `package.json` file ([commit](https://github.com/ultra-000/magiclinks/commit/c4a66debe73c3f2ad1ea0d0d7fcf44fede84587a))

<br/>

## [v1.1.0] - 2025-04-05

### Added
- Added support for building from other formats/extensions of files ([commit](https://github.com/ultra-000/magiclinks/commit/a1643b4f4ec907652139a13d1ef3371b75ab63be))

<br/>

## [v1.0.4] - 2025-04-05

### Changed
- Updated the `README.md` file with more info ([commit](https://github.com/ultra-000/magiclinks/commit/2d4ae8f95391e686a93396e52969a76a2beb943c))

<br/>

## [v1.0.3] - 2025-04-05

### Fixed
- Truly fixed the config loading logic ([commit](https://github.com/ultra-000/magiclinks/commit/4c163d54a2d31198975be4177a9374d5be480d7e))

<br/>

## [v1.0.2] - 2025-04-05

### Fixed
- Correct the previous incorrect fix for the config loading (again it haven't been fixed yet) ([commit](https://github.com/ultra-000/magiclinks/commit/6df82fdde86368f03eba7694a3e07da9f5d42809))

<br/>

## [v1.0.1] - 2025-04-05

### Fixed
- Fixed a bug (at least I thought I did) with config loading ([commit](https://github.com/ultra-000/magiclinks/commit/bcad7c4dd424d5494962ed6db1df22533a7fc1fe))

### Changed
- Updated `README.md` file with additional info ([#1 commit](https://github.com/ultra-000/magiclinks/commit/d38480a843f5580d0b9962663955e911603ded56)) ([#2 commit](https://github.com/ultra-000/magiclinks/commit/c76b33ad117cf7a6215bad474f59127736a58f7a))

<br/>

## [v1.0.0] - 2025-04-04

### Added
- First release for Magiclinks ([commit](https://github.com/ultra-000/magiclinks/commit/67078ccf5930877bfd37d7bd11c205c83ab5c1f9))

[v2.5.0]: https://github.com/ultra-000/magiclinks/tree/a08d5a3f3a5401aaca7278fd6a2dc9f5681786af
[v2.4.0]: https://github.com/ultra-000/magiclinks/tree/808b0a13f75cd8b362b9b30d7b16e164e5a83c68
[v2.3.1]: https://github.com/ultra-000/magiclinks/tree/a76fec69b84e666d782a4e11696be1b47a184a3b
[v2.3.0]: https://github.com/ultra-000/magiclinks/tree/8da67b9e9e38a3db0480d3c9b3f602759a74536a
[v2.2.0]: https://github.com/ultra-000/magiclinks/tree/8da67b9e9e38a3db0480d3c9b3f602759a74536a
[v2.1.3]: https://github.com/ultra-000/magiclinks/tree/b2d9fd0df6ada6abe8d8d95b91ff70741c07d448
[v2.1.2]: https://github.com/ultra-000/magiclinks/tree/97ccc86a99801dc65fe6b3817c819d6943a340a8
[v2.1.1]: https://github.com/ultra-000/magiclinks/tree/7db12db278f1f9ae7df81cc3d5d007c2c8f3c056
[v2.1.0]: https://github.com/ultra-000/magiclinks/tree/017fd54001a361e3800891e7be4c15f26935e169
[v2.0.1]: https://github.com/ultra-000/magiclinks/tree/aba4e3ce3c61e1480cabe616a50b1debb642f82e
[v2.0.0]: https://github.com/ultra-000/magiclinks/tree/7ee75e012874b646f21c07b23ec2cdb97ebd9b00
[v1.3.0]: https://github.com/ultra-000/magiclinks/tree/6a416c99fbee4481a276f37b884b28ef6b877c2f
[v1.2.12]: https://github.com/ultra-000/magiclinks/tree/ea84e87f1ffd10382d1615845662cce3abb22e19
[v1.2.11]: https://github.com/ultra-000/magiclinks/tree/b748777a188de7718863636c81b104bb460602f4
[v1.2.10]: https://github.com/ultra-000/magiclinks/tree/ef094e589ba60bf31f731da0b13a79b1a099e795
[v1.2.9]: https://github.com/ultra-000/magiclinks/tree/a6a5a96a3fc23275bf275242363cdd1460660c68
[v1.2.8]: https://github.com/ultra-000/magiclinks/tree/43d8160ce2b56c5bc1a58e190e8732109befdf60
[v1.2.7]: https://github.com/ultra-000/magiclinks/tree/03c9e662e61ac88523878b42b81b1dd9fb1f55e8
[v1.2.6]: https://github.com/ultra-000/magiclinks/tree/ed24f1c0dfeef49c93352c929d28664390d40725
[v1.2.5]: https://github.com/ultra-000/magiclinks/tree/25ae1b29ebd385a5b5422da45a91cfc60a6cdf29
[v1.2.4]: https://github.com/ultra-000/magiclinks/tree/64332676f98d7da6ea91847ada52fe12fc87a6d9
[v1.2.3]: https://github.com/ultra-000/magiclinks/tree/d15b61b84f01f077dd818c990ba029f1f4d189b1
[v1.2.2]: https://github.com/ultra-000/magiclinks/tree/0921e630de625b946bc53e64ec3257f05414849d
[v1.2.1]: https://github.com/ultra-000/magiclinks/tree/4c5607b498618a27a5271bd7a6c9d7fbc5f6f600
[v1.2.0]: https://github.com/ultra-000/magiclinks/tree/28cead00896b7d2a5d6c4e30efda7a53944d638c
[v1.1.1]: https://github.com/ultra-000/magiclinks/tree/69e6d00547fee0776d4ee20ec0ded5e79acbae4f
[v1.1.0]: https://github.com/ultra-000/magiclinks/tree/50130d15f072d0cf3c461dd4bd1d6aee223d3162
[v1.0.4]: https://github.com/ultra-000/magiclinks/tree/61b039bb8af196eba633a23d63060bbc45576eac
[v1.0.3]: https://github.com/ultra-000/magiclinks/tree/2f49ce14cfef9fd8741791ed3ec7ea79b3f87532
[v1.0.2]: https://github.com/ultra-000/magiclinks/tree/a73f8b671900d641b1032e2c6abba1ac123ac744
[v1.0.1]: https://github.com/ultra-000/magiclinks/tree/1f190ca974719c52fcf27623c7d92478998c1b1e
[v1.0.0]: https://github.com/ultra-000/magiclinks/tree/67078ccf5930877bfd37d7bd11c205c83ab5c1f9