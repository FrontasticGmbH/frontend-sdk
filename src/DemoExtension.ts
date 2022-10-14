import { sdk, SDK, Extension } from "./index";

sdk.configure({
	locale: "de_DE",
	currency: "EUR",
	endpoint: "my.cool.endpoint",
});

class DemoExtension extends Extension {
	constructor(sdk: SDK) {
		super(sdk);

		sdk.on("productAddedToCart", (event) => {
			event.data.product;
		});
	}

	unregisterExtension(): void { }
}

const demoExtension = new DemoExtension(sdk);
