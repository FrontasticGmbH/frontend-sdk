import { DIContainer } from "./injector";

export const isSDKConfigured = (diContainer: DIContainer) => {
	if (!diContainer.hasBeenConfigured) {
		throw new Error(
			`The SDK has not been configured. Please call .configure on the base SDK before you call any other methods`
		);
	}
};
