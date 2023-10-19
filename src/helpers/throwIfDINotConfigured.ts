import { SDK_NOT_CONFIGURED_ERROR_MESSAGE } from "../constants/sdkNotConfiguredErrorMessage";
import { diContainer } from "../library/DIContainer";

export const throwIfDINotConfigured = () => {
	if (!diContainer().hasBeenConfigured) {
		throw new Error(SDK_NOT_CONFIGURED_ERROR_MESSAGE);
	}
};
