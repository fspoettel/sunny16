# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.3.0 2017-09-01

### Added
- Added argument validation
- Added `getFilmSpeeds()` | `getShutterSpeeds()` getters
- Added `cameraSettings` alias
### Changed
- `exposureValue`, `lightValue` do not accept a config anymore
### Removed
- Removed direct access to constants

## 0.2.0 - 2017-08-20
### Changed
- Remove `Sunny16` class in favor of functional approach
### Fixed
- Fix minifaction failing to minify `clip()`

## 0.1.1 - 2017-08-14
### Fixed
- Rename `prepublish` npm task to `prepare`

## 0.1.0 - 2017-08-14
### Added
- Initial release
