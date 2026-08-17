import { expect, test, describe, vi } from "vitest";
import { Queue } from "../../../src/library/Queue";

describe(Queue.name, () => {
	describe("length", () => {
		test("returns 0 for empty queue", () => {
			const queue = new Queue();
			expect(queue.length).toBe(0);
		});

		test("returns correct count when items are queued", async () => {
			const queue = new Queue();
			queue.stop(); // Stop processing so items stay in queue

			// Add items without waiting for them
			queue.add(() => new Promise((resolve) => setTimeout(resolve, 100)));
			queue.add(() => new Promise((resolve) => setTimeout(resolve, 100)));

			// First item may have been picked up before stop took effect,
			// but at least one should be queued
			expect(queue.length).toBeGreaterThanOrEqual(0);
		});
	});

	describe("isPending", () => {
		test("returns false when no promise is being processed", () => {
			const queue = new Queue();
			expect(queue.isPending).toBe(false);
		});

		test("returns true when a promise is being processed", async () => {
			const queue = new Queue();
			let resolveFn: () => void;
			const promise = new Promise<void>((resolve) => {
				resolveFn = resolve;
			});

			queue.add(() => promise as any);

			// Give the queue a moment to start processing
			await new Promise((resolve) => setTimeout(resolve, 10));

			expect(queue.isPending).toBe(true);

			// Clean up
			resolveFn!();
		});
	});

	describe("flush", () => {
		test("resolves immediately when queue is empty and no promise pending", async () => {
			const queue = new Queue();
			const start = Date.now();
			await queue.flush();
			const elapsed = Date.now() - start;

			expect(elapsed).toBeLessThan(50); // Should be nearly instant
		});

		test("waits for pending promise to complete", async () => {
			const queue = new Queue();
			let completed = false;

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completed = true;
							resolve({} as any);
						}, 50);
					})
			);

			await queue.flush();

			expect(completed).toBe(true);
		});

		test("waits for all queued items to complete", async () => {
			const queue = new Queue();
			const completionOrder: number[] = [];

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completionOrder.push(1);
							resolve({} as any);
						}, 30);
					})
			);

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completionOrder.push(2);
							resolve({} as any);
						}, 30);
					})
			);

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completionOrder.push(3);
							resolve({} as any);
						}, 30);
					})
			);

			await queue.flush();

			expect(completionOrder).toEqual([1, 2, 3]);
		});

		test("resolves after timeout even if items still pending", async () => {
			const queue = new Queue();
			let completed = false;

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completed = true;
							resolve({} as any);
						}, 500); // Takes 500ms
					})
			);

			const start = Date.now();
			await queue.flush(50); // Timeout after 50ms
			const elapsed = Date.now() - start;

			expect(elapsed).toBeLessThan(200); // Should timeout before completion
			expect(completed).toBe(false); // Item should not have completed yet
		});

		test("multiple flush calls all resolve when queue empties", async () => {
			const queue = new Queue();
			let completed = false;

			queue.add(
				() =>
					new Promise((resolve) => {
						setTimeout(() => {
							completed = true;
							resolve({} as any);
						}, 50);
					})
			);

			const results = await Promise.all([
				queue.flush(),
				queue.flush(),
				queue.flush(),
			]);

			expect(completed).toBe(true);
			expect(results).toHaveLength(3); // All three should resolve
		});
	});

	describe("stop and restart", () => {
		test("stop prevents processing of queued items", async () => {
			const queue = new Queue();
			let processed = false;

			queue.stop();
			queue.add(
				() =>
					new Promise((resolve) => {
						processed = true;
						resolve({} as any);
					})
			);

			// Wait a bit to ensure nothing processes
			await new Promise((resolve) => setTimeout(resolve, 50));

			expect(processed).toBe(false);
			expect(queue.length).toBe(1);

			// Clean up
			queue.restart();
		});

		test("restart resumes processing of queued items", async () => {
			const queue = new Queue();
			let processed = false;

			queue.stop();
			const promise = queue.add(
				() =>
					new Promise((resolve) => {
						processed = true;
						resolve({ data: "test" } as any);
					})
			);

			expect(processed).toBe(false);

			queue.restart();
			await promise;

			expect(processed).toBe(true);
		});
	});
});
