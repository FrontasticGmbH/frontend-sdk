export class FetchError extends Error {
	constructor(error: string | Error) {
		super();

		if (typeof error === "string") {
			this.message = error;
		} else {
			Object.keys(error).forEach((key) => {
				this[key] = error[key as keyof typeof error];
			});
		}
	}

	[key: string]: any;
	message!: string;
}
