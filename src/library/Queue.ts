type QueueItem<T> = {
	promise: () => Promise<unknown>;
	resolve: (value: T) => void;
	reject: (reason?: any) => void;
};

export class Queue {
	#queue: QueueItem<any>[] = [];
	#promisePending = false;
	#stopped = false;

	add<T>(
		promise: () => Promise<{ frontasticRequestId: string; data: T }>
	): Promise<{ frontasticRequestId: string; data: T }> {
		return new Promise((resolve, reject) => {
			this.#queue.push({
				promise,
				resolve,
				reject,
			});
			this.#handle();
		});
	}

	stop() {
		this.#stopped = true;
	}

	restart() {
		this.#stopped = false;
		this.#handle();
	}

	#handle(): void {
		if (this.#promisePending || this.#stopped) {
			return;
		}
		const item = this.#queue.shift();
		if (!item) {
			return;
		}
		try {
			this.#promisePending = true;
			// TODO: check anonamous functions don't mess up stack trace too much
			item.promise()
				.then((value) => this.#resolve(() => item.resolve(value)))
				.catch((err) => this.#resolve(() => item.reject(err)));
		} catch (err) {
			this.#resolve(() => item.reject(err));
		}
	}

	#resolve(callback: () => void): void {
		this.#promisePending = false;
		callback();
		this.#handle();
	}
}
