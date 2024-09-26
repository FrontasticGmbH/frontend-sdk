import { FetcherResponse } from "../helpers/fetcher";

type QueueItem<T> = {
	promise: () => Promise<unknown>;
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
};

export class Queue {
	private queue: QueueItem<any>[] = [];
	private promisePending = false;
	private stopped = false;

	add<T>(
		promise: () => Promise<FetcherResponse<T>>
	): Promise<FetcherResponse<T>> {
		return new Promise((resolve, reject) => {
			this.queue.push({
				promise,
				resolve,
				reject,
			});
			this.handle();
		});
	}

	stop() {
		this.stopped = true;
	}

	restart() {
		this.stopped = false;
		this.handle();
	}

	private handle(): void {
		if (this.promisePending || this.stopped) {
			return;
		}
		const item = this.queue.shift();
		if (!item) {
			return;
		}
		try {
			this.promisePending = true;
			item.promise()
				.then((value) => this.resolve(() => item.resolve(value)))
				.catch((err) => this.resolve(() => item.reject(err)));
		} catch (err) {
			this.resolve(() => item.reject(err));
		}
	}

	private resolve(callback: () => void): void {
		this.promisePending = false;
		callback();
		this.handle();
	}
}
