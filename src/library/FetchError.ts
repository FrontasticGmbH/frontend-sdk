export class FetchError extends Error {
	constructor(error: string | Error) {
		super();

		this.isError = true;
		if (typeof error === "string") {
			this.message = error;
		} else {
			Object.keys(error).forEach((key) => {
				this[key] = error[key as keyof typeof error];
			});
		}
	}

	[key: string]: any;
	isError: boolean;
	message!: string;
}
