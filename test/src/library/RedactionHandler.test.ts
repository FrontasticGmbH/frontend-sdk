import { describe, test, expect, vi, afterAll } from "vitest";
import {
	defaultRedactionRules,
	defaultJsonRedactionText,
	defaultUrlRedactionText,
} from "../../../src/constants/defaultRedactionRules";
import { generateQueryString } from "../../../src/helpers/urlHelpers";
import { RedactionHandler } from "../../../src/library/RedactionHandler";
import { RedactionManagerConfig } from "../../../src/types/redactionHandling/RedactionManagerConfig";

describe(RedactionHandler.name, () => {
	afterAll(() => {
		vi.resetAllMocks();
	});

	describe("redact", () => {
		describe("default rules", () => {
			test("should redact all password properties and variants without case-sensitivity", () => {
				const data = {
					password: "password",
					oldPassword: "oldPassword",
					oldpassword: "oldpassword",
					newPassword: "newPassword",
					newpassword: "newpassword",
					prop: [
						{ password: "prop.password" },
						{ oldPassword: "prop.oldPassword" },
						{ oldpassword: "prop.oldpassword" },
						{ newPassword: "prop.newPassword" },
						{ newpassword: "prop.newpassword" },
					],
					prop2: {
						prop2_1: {
							password: "prop2.prop2_1.password",
							oldPassword: "prop2.prop2_1.oldPassword",
							oldpassword: "prop2.prop2_1.oldpassword",
							newPassword: "prop2.prop2_1.newPassword",
							newpassword: "prop2.prop2_1.newpassword",
						},
					},
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.password).toBe(defaultJsonRedactionText);
				expect(returnedData.oldPassword).toBe(defaultJsonRedactionText);
				expect(returnedData.oldpassword).toBe(defaultJsonRedactionText);
				expect(returnedData.newPassword).toBe(defaultJsonRedactionText);
				expect(returnedData.newpassword).toBe(defaultJsonRedactionText);
				expect(returnedData.prop[0].password).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop[1].oldPassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop[2].oldpassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop[3].newPassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop[4].newpassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop2.prop2_1.password).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop2.prop2_1.oldPassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop2.prop2_1.oldpassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop2.prop2_1.newPassword).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.prop2.prop2_1.newpassword).toBe(
					defaultJsonRedactionText
				);
			});

			test('redacts "token" properties without case sensitivity', () => {
				const data = {
					token: "token",
					TOKEN: 654328,
					Token: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.token).toBe(defaultJsonRedactionText);
				expect(returnedData.TOKEN).toBe(defaultJsonRedactionText);
				expect(returnedData.Token).toBe(defaultJsonRedactionText);
			});

			test('redacts "accessToken" properties without case sensitivity', () => {
				const data = {
					accessToken: "accessToken",
					ACCESSTOKEN: 654328,
					AccessToken: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.accessToken).toBe(defaultJsonRedactionText);
				expect(returnedData.ACCESSTOKEN).toBe(defaultJsonRedactionText);
				expect(returnedData.AccessToken).toBe(defaultJsonRedactionText);
			});

			test('redacts "apiToken" properties without case sensitivity', () => {
				const data = {
					apiToken: "apiToken",
					APITOKEN: 654328,
					ApiToken: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.apiToken).toBe(defaultJsonRedactionText);
				expect(returnedData.APITOKEN).toBe(defaultJsonRedactionText);
				expect(returnedData.ApiToken).toBe(defaultJsonRedactionText);
			});

			test("redacts previewToken properties without case sensitivity", () => {
				const data = {
					previewToken: "previewToken",
					PREVIEWTOKEN: 654328,
					PreviewToken: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.previewToken).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.PREVIEWTOKEN).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.PreviewToken).toBe(
					defaultJsonRedactionText
				);
			});

			test('redacts "apiKey" properties without case sensitivity', () => {
				const data = {
					apiKey: "apiKey",
					APIKEY: 654328,
					ApiKey: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.apiKey).toBe(defaultJsonRedactionText);
				expect(returnedData.APIKEY).toBe(defaultJsonRedactionText);
				expect(returnedData.ApiKey).toBe(defaultJsonRedactionText);
			});

			test('redacts "apiSecret" properties without case sensitivity', () => {
				const data = {
					apiSecret: "apiSecret",
					APISECRET: 654328,
					ApiSecret: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.apiSecret).toBe(defaultJsonRedactionText);
				expect(returnedData.APISECRET).toBe(defaultJsonRedactionText);
				expect(returnedData.ApiSecret).toBe(defaultJsonRedactionText);
			});

			test('redacts "clientId" properties without case sensitivity', () => {
				const data = {
					clientId: "clientId",
					CLIENTID: 654328,
					ClientId: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.clientId).toBe(defaultJsonRedactionText);
				expect(returnedData.CLIENTID).toBe(defaultJsonRedactionText);
				expect(returnedData.ClientId).toBe(defaultJsonRedactionText);
			});

			test('redacts "clientSecret" properties without case sensitivity', () => {
				const data = {
					clientSecret: "clientSecret",
					CLIENTSECRET: 654328,
					ClientSecret: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.clientSecret).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.CLIENTSECRET).toBe(
					defaultJsonRedactionText
				);
				expect(returnedData.ClientSecret).toBe(
					defaultJsonRedactionText
				);
			});

			test('redacts "secret" properties without case sensitivity', () => {
				const data = {
					secret: "secret",
					SECRET: 654328,
					Secret: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.secret).toBe(defaultJsonRedactionText);
				expect(returnedData.SECRET).toBe(defaultJsonRedactionText);
				expect(returnedData.Secret).toBe(defaultJsonRedactionText);
			});

			test('redacts "metaData" properties without case sensitivity', () => {
				const data = {
					metaData: "metaData",
					METADATA: 654328,
					MetaData: true,
				};

				const returnedData = new RedactionHandler(
					defaultRedactionRules
				).redact(data);

				expect(returnedData.metaData).toBe(defaultJsonRedactionText);
				expect(returnedData.METADATA).toBe(defaultJsonRedactionText);
				expect(returnedData.MetaData).toBe(defaultJsonRedactionText);
			});
		});

		test("redacts all paths specified and no other properties without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{ value: "pathToRedact", caseSensitive: false },
					{ value: "myObject.myPathToRedact", caseSensitive: false },
					{
						value: "myObject.nestedObject.nestedPathToRedact",
						caseSensitive: false,
					},
				],
			};

			const data = {
				pathToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPathToRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPathToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					mypathToRedact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.pathToRedact).toBe(defaultJsonRedactionText);
			expect(returnedData.myObject.myPathToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.nestedObject.nestedPathToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myobject.mypathToRedact).toBe(
				defaultJsonRedactionText
			);

			expect(returnedData.otherProperty).toBe(data.otherProperty);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);
		});

		test("redacts all paths specified and no other properties with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{ value: "pathToRedact", caseSensitive: true },
					{ value: "myObject.myPathToRedact", caseSensitive: true },
					{
						value: "myObject.nestedObject.nestedPathToRedact",
						caseSensitive: true,
					},
				],
			};

			const data = {
				pathToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPathToRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPathToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					mypathToRedact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.pathToRedact).toBe(defaultJsonRedactionText);
			expect(returnedData.myObject.myPathToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.nestedObject.nestedPathToRedact).toBe(
				defaultJsonRedactionText
			);

			expect(returnedData.otherProperty).toBe(data.otherProperty);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);
			expect(returnedData.myobject.mypathToRedact).toBe(
				data.myobject.mypathToRedact
			);
		});

		test("redacts all properties specified and no other properties without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				properties: [
					{ value: "myPropertyToRedact", caseSensitive: false },
					{ value: "nestedPropertyToRedact", caseSensitive: false },
				],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					mypropertytoRedact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);
			expect(returnedData.myobject.mypropertytoRedact).toBe(
				defaultJsonRedactionText
			);

			expect(returnedData.otherProperty).toBe(data.otherProperty);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);
		});

		test("redacts all properties specified and no other properties with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				properties: [
					{ value: "myPropertyToRedact", caseSensitive: true },
					{ value: "nestedPropertyToRedact", caseSensitive: true },
				],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					mypropertytoRedact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);

			expect(returnedData.otherProperty).toBe(data.otherProperty);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);
			expect(returnedData.myobject.mypropertytoRedact).toBe(
				data.myobject.mypropertytoRedact
			);
		});

		test("redacts all properties specified by other config parameters except paths specified by whitelistPaths without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{
						value: "myObject.nestedObject.nestedPathToRedact",
					},
				],
				properties: [{ value: "myPropertyToNotRedact" }],
				whitelistPaths: [
					{
						value: "myObject.myPropertyToNotRedact",
					},
				],
				includes: [{ value: "Redact" }],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToNotRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					myPropertyToNotredact: "case insensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.otherProperty).toBe(data.otherProperty);

			expect(returnedData.myObject.myPropertyToNotRedact).toBe(
				data.myObject.myPropertyToNotRedact
			);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);

			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);

			expect(returnedData.myobject.myPropertyToNotredact).toBe(
				data.myobject.myPropertyToNotredact
			);
		});

		test("redacts all properties specified by other config parameters except paths specified by whitelistPaths with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{
						value: "myObject.nestedObject.nestedPathToRedact",
						caseSensitive: true,
					},
				],
				properties: [
					{ value: "myPropertyToNotRedact", caseSensitive: true },
				],
				whitelistPaths: [
					{
						value: "myObject.myPropertyToNotRedact",
						caseSensitive: true,
					},
				],
				includes: [{ value: "Redact", caseSensitive: true }],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToNotRedact: "my credit card number",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					myPropertyToNotredact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.otherProperty).toBe(data.otherProperty);

			expect(returnedData.myObject.myPropertyToNotRedact).toBe(
				data.myObject.myPropertyToNotRedact
			);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);

			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);

			expect(returnedData.myobject.myPropertyToNotredact).toBe(
				data.myobject.myPropertyToNotredact
			);
		});

		test("redacts all includes specified for all matching properties and no others, with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [
					{ value: "Redact", caseSensitive: true },
					{ value: "AlsoRed", caseSensitive: true },
				],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToRedact: "my credit card number",
					myPropertyToAlsoRed: "my email address",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					myPropertytoredact: "case sensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.otherProperty).toBe(data.otherProperty);

			expect(returnedData.myObject.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.myPropertyToAlsoRed).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);

			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);

			expect(returnedData.myobject.myPropertytoredact).toBe(
				data.myobject.myPropertytoredact
			);
		});

		test("redacts all includes specified for all matching properties and no others, without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [
					{ value: "Redact", caseSensitive: false },
					{ value: "alsored", caseSensitive: false },
				],
			};

			const data = {
				myPropertyToRedact: "my password",
				otherProperty: "some string",
				myObject: {
					myPropertyToRedact: "my credit card number",
					myPropertyToAlsoRed: "my email address",
					otherProperty: "my other property",
					nestedObject: {
						nestedPropertyToRedact: "my home address",
						myOtherNestedProperty: "my other nested property",
					},
				},
				myobject: {
					myPropertytoredact: "case insensitivity check",
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(returnedData.myObject.myPropertyToRedact).toBe(
				defaultJsonRedactionText
			);
			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(defaultJsonRedactionText);
			expect(returnedData.myobject.myPropertytoredact).toBe(
				defaultJsonRedactionText
			);

			expect(returnedData.otherProperty).toBe(data.otherProperty);
			expect(returnedData.myObject.otherProperty).toBe(
				data.myObject.otherProperty
			);
			expect(
				returnedData.myObject.nestedObject.myOtherNestedProperty
			).toBe(data.myObject.nestedObject.myOtherNestedProperty);
		});

		test(`replaces the default redaction text of "${defaultJsonRedactionText}" with custom jsonRedactionText passed in ctor`, () => {
			const customJsonRedactionText = "Custom JSON Redaction Text";
			const customOverrideRules: RedactionManagerConfig = {
				includes: [{ value: "Redact", caseSensitive: false }],
				jsonRedactionText: customJsonRedactionText,
			};

			const data = {
				propertyToRedact: "my password",
				myObject: {
					nestedObject: {
						nestedPropertyToRedact: "my home address",
					},
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.propertyToRedact).toBe(customJsonRedactionText);
			expect(
				returnedData.myObject.nestedObject.nestedPropertyToRedact
			).toBe(customJsonRedactionText);
		});

		test("redacts queries in all url formatted JSON properties by rules passed", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [{ value: "Redact", caseSensitive: false }],
			};

			const httpUrl =
				"http://mywebsite/page?toRedact=toredact&" +
				"prop=myProperty&nestedObject%5BdeeperNestedObject%5D%5BpasswordToRedact%5D=5BpasswordToRedact";
			const redactedHttpUrl =
				`http://mywebsite/page?toRedact=${defaultUrlRedactionText}&` +
				`prop=myProperty&nestedObject%5BdeeperNestedObject%5D%5BpasswordToRedact%5D=${defaultUrlRedactionText}`;

			const httpsUrl =
				"https://someothersite?nestedObject%5BnestedArray%5D%5B1%5D%5BredactArrayPassword%5D=sometext";
			const redactedHttpsUrl = `https://someothersite/?nestedObject%5BnestedArray%5D%5B1%5D%5BredactArrayPassword%5D=${defaultUrlRedactionText}`;

			const websocketUrl =
				"ws://somewebsocketurl?somePropToRedact=2dfg3yuk4d&" +
				"nestedObject%5BdeeperNestedObject%5D%5BtoRedact%5D=lorem+ipsum";
			const redactedWebsocketUrl =
				`ws://somewebsocketurl/?somePropToRedact=${defaultUrlRedactionText}&` +
				`nestedObject%5BdeeperNestedObject%5D%5BtoRedact%5D=${defaultUrlRedactionText}`;

			const ftpUrl =
				"ftp://somewebsocketurl?somePropToRedact=2dfg3yuk4d&" +
				"nestedObject%5BdeeperNestedObject%5D%5BtoRedact%5D=lorem+ipsum";
			const redactedFtpUrl =
				`ftp://somewebsocketurl/?somePropToRedact=${defaultUrlRedactionText}&` +
				`nestedObject%5BdeeperNestedObject%5D%5BtoRedact%5D=${defaultUrlRedactionText}`;

			const data = {
				httpUrl,
				myObject: {
					httpsUrl,
					nestedObject: {
						websocketUrl,
						ftpUrl,
					},
				},
			};

			const returnedData = new RedactionHandler(
				customOverrideRules
			).redact(data);

			expect(returnedData.httpUrl).toBe(redactedHttpUrl);
			expect(returnedData.myObject.httpsUrl).toBe(redactedHttpsUrl);
			expect(returnedData.myObject.nestedObject.websocketUrl).toBe(
				redactedWebsocketUrl
			);
			expect(returnedData.myObject.nestedObject.ftpUrl).toBe(
				redactedFtpUrl
			);
		});
	});

	describe("redactUrl", () => {
		describe("default rules", () => {
			test("should redact password and token properties and variants of type string, boolean and number values without case-sensitivity", () => {
				const object = {
					nestedObject: {
						deeperNestedObject: {
							oldPassword: "old pasword",
							newPassword: "new pasword",
							password: "my pasword",
							token: "super secret nested token",
							notToRedact: "lorem ipsum",
						},
						nestedArray: [
							{},
							{
								oldArrayPassword: "old pasword",
								newArrayPassword: "new pasword",
								arrayPassword: true,
								token: 60865345675,
								alsoNotToRedact: "ipsum lorem",
							},
						],
					},
				} as const;
				const token = "45mkmblmby3kymb56ky5by";
				const password = "Password1";
				const someId = "45vt45t4r454";
				const inputUrl = `https://localhost/page?token=${token}&password=${password}&someId=${someId}&${generateQueryString(
					// @ts-expect-error
					object
				).slice(1)}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				const expectedOutputUrl =
					`https://localhost/page?token=${defaultUrlRedactionText}&password=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BoldPassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BdeeperNestedObject%5D%5BnewPassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BdeeperNestedObject%5D%5Bpassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BdeeperNestedObject%5D%5Btoken%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BdeeperNestedObject%5D%5BnotToRedact%5D=lorem+ipsum&` +
					`nestedObject%5BnestedArray%5D%5B1%5D%5BoldArrayPassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BnestedArray%5D%5B1%5D%5BnewArrayPassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BnestedArray%5D%5B1%5D%5BarrayPassword%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BnestedArray%5D%5B1%5D%5Btoken%5D=${defaultUrlRedactionText}&` +
					`nestedObject%5BnestedArray%5D%5B1%5D%5BalsoNotToRedact%5D=ipsum+lorem`;

				// this test passing is prefaced on urlHelpers/generateQueryString tests passing, anything changed on those methods
				// and/or tests breaking may break this test
				expect(redactedUrl).toBe(expectedOutputUrl);
			});

			test('redacts "accessToken" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?accessToken=to+redact&AccessToken=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BACCESSTOKEN%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?accessToken=${defaultUrlRedactionText}&AccessToken=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BACCESSTOKEN%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "apiToken" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?apiToken=to+redact&ApiToken=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BAPITOKEN%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?apiToken=${defaultUrlRedactionText}&ApiToken=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BAPITOKEN%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "previewToken" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?previewToken=to+redact&PreviewToken=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BPREVIEWTOKEN%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?previewToken=${defaultUrlRedactionText}&PreviewToken=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BPREVIEWTOKEN%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "apiKey" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?apiKey=to+redact&ApiKey=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BAPIKEY%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?apiKey=${defaultUrlRedactionText}&ApiKey=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BAPIKEY%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "apiSecret" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?apiSecret=to+redact&ApiSecret=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BAPISECRET%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?apiSecret=${defaultUrlRedactionText}&ApiSecret=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BAPISECRET%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "clientId" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?clientId=to+redact&ClientId=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BCLIENTID%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?clientId=${defaultUrlRedactionText}&ClientId=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BCLIENTID%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "clientSecret" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?clientSecret=to+redact&ClientSecret=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BCLIENTSECRET%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?clientSecret=${defaultUrlRedactionText}&ClientSecret=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BCLIENTSECRET%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "secret" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?secret=to+redact&Secret=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BSECRET%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?secret=${defaultUrlRedactionText}&Secret=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BSECRET%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});

			test('redacts "metaData" properties without case sensitivity', () => {
				const inputUrl =
					"https://localhost/page?metaData=to+redact&MetaData=my+access+token&someId=45vt45t4r454&" +
					"nestedObject%5BdeeperNestedObject%5D%5BMETADATA%5D=my+private+text";
				const expectedRedactedUrl =
					`https://localhost/page?metaData=${defaultUrlRedactionText}&MetaData=${defaultUrlRedactionText}&someId=45vt45t4r454&` +
					`nestedObject%5BdeeperNestedObject%5D%5BMETADATA%5D=${defaultUrlRedactionText}`;

				const redactedUrl = new RedactionHandler(
					defaultRedactionRules
				).redactUrl(inputUrl);

				expect(redactedUrl).toBe(expectedRedactedUrl);
			});
		});

		test("redacts paths specified and no other properties without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{ value: "pathToRedact", caseSensitive: false },
					{
						value: "myObject.nestedObject.nestedPathToRedact",
						caseSensitive: false,
					},
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToRedact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5Bnestedobject%5D%5BnestedPathToRedact%5D=${query.myobject.nestedobject.nestedPathToRedact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${defaultUrlRedactionText}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5Bnestedobject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts paths specified and no other properties with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				paths: [
					{ value: "pathToRedact", caseSensitive: true },
					{
						value: "myObject.nestedObject.nestedPathToRedact",
						caseSensitive: true,
					},
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToRedact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToRedact%5D=${query.myobject.nestedobject.nestedPathToRedact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToRedact%5D=${query.myobject.nestedobject.nestedPathToRedact}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all properties specified and no other properties without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				properties: [
					{ value: "pathToRedact", caseSensitive: false },
					{ value: "nestedPathToRedact", caseSensitive: false },
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${defaultUrlRedactionText}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${defaultUrlRedactionText}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${defaultUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all properties specified and no other properties with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				properties: [
					{ value: "pathToRedact", caseSensitive: true },
					{ value: "nestedPathToRedact", caseSensitive: true },
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${defaultUrlRedactionText}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all properties specified by other config parameters except paths specified by whitelistPaths without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [{ value: "redact", caseSensitive: false }],
				whitelistPaths: [
					{ value: "pathToRedact", caseSensitive: false },
					{
						value: "myObject.nestedObject.pathToRedact",
						caseSensitive: false,
					},
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${defaultUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all properties specified by other config parameters except paths specified by whitelistPaths with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [{ value: "redact", caseSensitive: false }],
				whitelistPaths: [
					{ value: "pathToRedact", caseSensitive: true },
					{
						value: "myObject.nestedObject.pathToRedact",
						caseSensitive: true,
					},
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${defaultUrlRedactionText}&` +
				`myObject%5BmyPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${defaultUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all includes specified and no other properties without case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [
					{ value: "pathToRedact", caseSensitive: false },
					{ value: "NESTED", caseSensitive: false },
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathNotToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathNotToRedact%5D=${query.myObject.myPathNotToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${defaultUrlRedactionText}&` +
				`myObject%5BmyPathNotToRedact%5D=${query.myObject.myPathNotToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${defaultUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${defaultUrlRedactionText}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${defaultUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test("redacts all includes specified and no other properties with case sensitivity", () => {
			const customOverrideRules: RedactionManagerConfig = {
				includes: [
					{ value: "pathToRedact", caseSensitive: true },
					{ value: "NESTED", caseSensitive: true },
				],
			};

			const query = {
				pathToRedact: "myPassword",
				pathToredact: "caseSensitivityCheck",
				myObject: {
					myPathToRedact: "myCreditCardNumber",
					nestedObject: {
						nestedPathToRedact: "myHomeAddress",
						pathToRedact: "myOtherNestedProperty",
					},
				},
				myobject: {
					nestedobject: {
						nestedPathToredact: "caseSensitivityCheck",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${defaultUrlRedactionText}&` +
				`pathToredact=${query.pathToredact}&` +
				`myObject%5BmyPathToRedact%5D=${query.myObject.myPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BnestedPathToRedact%5D=${query.myObject.nestedObject.nestedPathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${defaultUrlRedactionText}&` +
				`myobject%5D%5Bnestedobject%5D%5BnestedPathToredact%5D=${query.myobject.nestedobject.nestedPathToredact}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});

		test(`replaces the default redaction text of "${defaultUrlRedactionText}" with custom urlRedactionText passed in ctor`, () => {
			const customUrlRedactionText = "customUrlRedactionText";
			const customOverrideRules: RedactionManagerConfig = {
				includes: [{ value: "redact", caseSensitive: false }],
				urlRedactionText: customUrlRedactionText,
			};

			const query = {
				pathToRedact: "myPassword",
				myObject: {
					nestedObject: {
						pathToRedact: "myOtherNestedProperty",
					},
				},
			};

			const inputUrl =
				`https://localhost/page?pathToRedact=${query.pathToRedact}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${query.myObject.nestedObject.pathToRedact}`;

			const redactedUrl = new RedactionHandler(
				customOverrideRules
			).redactUrl(inputUrl);

			const expectedOutputUrl =
				`https://localhost/page?pathToRedact=${customUrlRedactionText}&` +
				`myObject%5BnestedObject%5D%5BpathToRedact%5D=${customUrlRedactionText}`;

			expect(redactedUrl).toBe(expectedOutputUrl);
		});
	});
});
