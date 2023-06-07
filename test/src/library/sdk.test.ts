import { beforeAll, describe,expect, test} from "vitest";
import {SDK, ServerOptions} from "../../../src";
import {AcceptedQueryTypes} from "../../../src/types/Query";


describe("SDK", () => {
	let sdk;
	beforeAll(() => {
		sdk = new SDK();
		sdk.configure({ locale: "ne_NP@NPR",
			currency: "EUR",
			useCurrencyInLocale: true,
			endpoint: "url",
			sessionLifeTime: 1000,
			});

	});

	it('should test remember cookie', function () {
		expect(sdk.fetcher).toBe("ne-NP");
		const options= {
			actionName: "test",
		}
		const response = sdk.callAction(options);



	});

})
