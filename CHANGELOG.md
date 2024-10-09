
## Version 6.1.0-alpha.0 (2024-10-09)


* Export redaction related classed and types from index

## Version 6.0.2-alpha.0 (2024-10-02)


* Exported page API types from index, change queueAction param in callAction to parallel

## Version 6.0.1-alpha.0 (2024-09-26)


- Updated version

## Version 6.0.0-alpha.0 (2024-09-26)


- Alpha 2.0.0 release

## Version 1.13.2 (2024-08-29)


* Changed internal locale handling to use string instead of Intl.Locale 

## Version 1.13.1 (2024-06-20)


* Erronously passed undefined values are no longer serialised into the query

## Version 1.13.0 (2024-06-19)


* Added compatability for all JSON serialisable types in query

## Version 1.12.3 (2024-06-17)


* Updated query serialisation to support square bracket syntax

## Version 1.12.2 (2024-06-13)


* Fixed array serialisation into query
* Fixed jsdocs customerHeaderValue type

## Version 1.12.1 (2024-05-16)


* Fixed edge case with URL normalisation where URL in query replaces domain

## Version 1.12.0 (2024-05-14)


* Added support to add coFE-Custom-Configuration header value globally via configure, and modularly on callAction and PageAPI methods

## Version 1.11.2 (2024-05-02)


* Fixed bug in error reporting affecting versions 1.11.0 and 1.11.1

## Version 1.11.1 (2024-04-24)


* Reverted PageAPI interfaces back to types due to unintended breaking change

## Version 1.11.0 (2024-04-24)


* Added Frontastic-Request-Id to errorCaught event trigger
* Added Frontastic-Request-Id header value to SDKResponse
* Added unnecessary project files for omission on library release
* Changed PageAPI types to interfaces

## Version 1.10.1 (2024-04-09)


* Removed httpOnly flag from cookie options as default

## Version 1.10.0 (2024-04-09)


* Set cookie options httpOnly and secure to true by default
* Added the ability to skip the action queue on the SDK.callAction method

## Version 1.9.3 (2024-03-04)


* Improved error handling

## Version 1.9.2 (2024-02-28)


* Error values are explicity set to correct loss of data

## Version 1.9.1 (2024-02-06)


* Updated README.md

## Version 1.9.0 (2023-11-28)


* Removed deprecated orderHistoryFetched event
* Added ability to override cookie handling in SDK.configure

## Version 1.8.2 (2023-08-16)


* Deprecated Extension base class, replaced with Integration to correct terminolgy

## Version 1.8.1 (2023-06-29)


* Added support for 6 digit locales

## Version 1.8.0 (2023-06-22)


* Added SSR support for rememberMeCookie helpers
* Added JSdocs for intellisense
* Update remember me cookie helpers to use new SSR compliant cookie management tools
* Separated types into their own files
* Added customization option for session lifetime
* Removed unused private methods on the EventManager

## Version 1.7.7 (2023-05-31)


* Send currency across in header for API calls
* Test for missing endpoint on protocol and add if missing

## Version 1.7.6 (2023-04-26)


* fix: include headers from IncomingMessage on SSR fetch

## Version 1.7.5 (2023-04-25)


* Added ServerOption support for getPreview and getPages methods

## Version 1.7.4 (2023-04-24)


* Added ServerOptions type to index export

## Version 1.7.3 (2023-04-24)


* Updated version

## Version 1.7.2 (2023-04-24)


* Updated version

## Version 1.7.1 (2023-04-24)


* Rework of cookie handling for better SSR support

## Version 1.7.0 (2023-04-19)


* feat: added support to pass serverSession in callAction

## Version 1.6.2 (2023-04-19)


* fix: compatibility with non-v8 browsers

## Version 1.6.1 (2023-04-19)


* Replaced esbuild and tsc for tsup build

## Version 1.6.0 (2023-04-06)


* Added optional serverSession parameter to getPage to pass server session for SSR
* Added serverSession helper to access server session cookie

## Version 1.5.0 (2023-04-03)


* Replaced automatic assigning of Commercetools-Frontend-Extension-Version header in fetcher with optional extensionVersion parameter in SDKConfig

## Version 1.4.1 (2023-03-29)


* Added throwIfNotConfigured method to Page API calls
* Added optional query param to getPage

## Version 1.4.0 (2023-03-22)


* Implemented getPages method

## Version 1.3.0 (2023-03-20)


* Added getPreview page API method
* fix: removed nested isError property from FetchError

## Version 1.2.7 (2023-03-14)


* fix: only add Commercetools-Frontend-Extension-Version header if NEXT_PUBLIC_EXT_BUILD_ID provided

## Version 1.2.6 (2023-03-14)


* fix: type generation, exclude test folder from build

## Version 1.2.5 (2023-03-14)


* fix: updated node version

## Version 1.2.4 (2023-03-14)


* fix: Use Commercetools-Frontend-Extension-Version header on SDK
* feat: SDK accepts posix and bcp47 language tags/locales

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

## Version 1.0.0-alpha.0 (2022-11-29)


* Initial release
