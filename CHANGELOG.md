
## Version 1.2.2 (2023-02-28)





* fix: included @frontastic/extension-types as dependency

## Version 1.2.1 (2023-02-28)



* Added support for arrays in action queries

## Version 1.2.0 (2023-02-28)

* Added page API with getPage method

## Version 1.1.4 (2023-02-24)

* Changed BUILD_ID to EXT_BUILD_ID

## Version 1.1.3 (2023-02-22)

* fix: added NEXT_PUBLIC prefix to BUILD_ID env variable

## Version 1.1.2 (2023-02-22)

* fix: issue with previous release process 

## Version 1.1.1 (2023-02-22)

* fix: updated @types/node

## Version 1.1.0 (2023-02-22)

* feat: Added access token support for multitenancy projects
* Added node to types in tsconfig

## Version 1.0.4 (2023-01-19)

* fix: error in error event trigger after reformatting

## Version 1.0.3 (2023-01-19)

* Updated perttier config and ran fix
* Removed trailingComma:all
* Added editorconfig for github to render tabs properly

## Version 1.0.1 (2023-01-18)

* Fix up prettier config to better suit the project

## Version 1.0.0 (2023-01-16)

* Full release out of alpha/beta
* Removed getPage for later release

## Version 5.0.0-alpha.0 (2023-01-06)

* Added generic type for CustomEvents to abstract extension class
* Exported SDKResponse type from package index
* Removed redundant StandardAction type
* Added generic type for Events
* (fix): bug in SDK error handling, wrapping error in { isError: false, data: error }

## Version 4.0.4-alpha.0 (2023-01-04)

* Fixed typo in .npmignore

## Version 4.0.3-alpha.0 (2023-01-04)

* Added .npmignore to optimise package size

## Version 4.0.2-alpha.0 (2022-12-20)

* Replaced webpack build with esbuild and tsc

## Version 4.0.1-alpha.0 (2022-12-14)

* fix: export SDK class type for extension

## Version 4.0.0-alpha.0 (2022-12-14)

* Removed SDK class from public export
* Changed format of params of callAction and getPage mathods

## Version 3.2.0-alpha.0 (2022-12-13)

Updated and extended StandardEvents type

## Version 3.1.0-alpha.0 (2022-12-13)

* Updated StandardEvents type

## Version 3.0.0-alpha.0 (2022-12-12)

* Added more descriptive error types, error event triggering handled by SDK
* Updated type of dynamic event return to object with unknown keys and data

## Version 2.4.1-alpha.0 (2022-12-09)

* Exposed ActionError class

## Version 2.4.0-alpha.0 (2022-12-09)

* Updated data type of action error event

## Version 2.3.0-alpha.0 (2022-12-09)

* Changed return type of callAction to better describe and handle errors

## Version 2.2.0-alpha.0 (2022-12-09)

* Added actionError StandardEvent type

## Version 2.1.0-alpha.0 (2022-12-09)

* Updated callAction return type so cannot be void
* Event names modified
* Updated fomatting of CHANGELOG.md
* Fixed dependency issues

## Version 2.0.0-alpha.0 (2022-12-06)

* Fixed major NPM deployment issue

## Version 1.1.3-alpha.0 (2022-12-06)

* Updated prepublishOnly script

## Version 1.1.1-alpha.0 (2022-12-06)

* Updated name of emitter class and export type

## Version 1.1.0-alpha.0 (2022-12-05)

* Added error handling

## Version 1.0.7-alpha.0 (2022-12-05)

* Hide event handler modifiers to prevent extensions accessing others

## Version 1.0.6-alpha.0 (2022-11-30)

* Fixed typo in README.md

## Version 1.0.5-alpha.0 (2022-11-30)

* Updated method name 

## Version 1.0.4-alpha.0 (2022-11-30)

* Added README.md

## Version 1.0.3-alpha.0 (2022-11-29)

* Initial release

## Version 1.0.0-alpha.0 (2022-11-29)

* Initial release
