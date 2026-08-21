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
	private flushResolvers: Array<() => void> = [];

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

	/**
	 * Returns a promise that resolves when all queued items have been processed.
	 * Useful for ensuring all pending requests complete before session invalidation.
	 *
	 * @param {number} [timeoutMs] - Optional timeout in milliseconds. If not provided, waits indefinitely.
	 * @returns {Promise<void>} Resolves when queue is empty or timeout is reached.
	 */
	flush(timeoutMs?: number): Promise<void> {
		// If queue is empty and no promise pending, resolve immediately
		if (this.queue.length === 0 && !this.promisePending) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			// Add resolver to be called when queue empties
			this.flushResolvers.push(resolve);

			// Optional timeout
			if (timeoutMs !== undefined) {
				setTimeout(() => {
					const index = this.flushResolvers.indexOf(resolve);
					if (index > -1) {
						this.flushResolvers.splice(index, 1);
						resolve();
					}
				}, timeoutMs);
			}
		});
	}

	/**
	 * Returns the number of items currently in the queue.
	 */
	get length(): number {
		return this.queue.length;
	}

	/**
	 * Returns true if a promise is currently being processed.
	 */
	get isPending(): boolean {
		return this.promisePending;
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

		// If queue is now empty, resolve all flush waiters
		if (this.queue.length === 0) {
			this.flushResolvers.forEach((resolver) => resolver());
			this.flushResolvers = [];
		}

		this.handle();
	}
}
