import { expect, test, describe, vi } from "vitest";
import { EventManager } from "../../../src/library/EventManager";
import { Event } from "../../../src/library/Event";

type TestEvents = {
	testEvent: { message: string };
	anotherEvent: { value: number };
};

describe(EventManager.name, () => {
	describe("hasEventHandlers", () => {
		test("returns false when no handlers are registered", () => {
			const manager = new EventManager<TestEvents>();
			expect(manager.hasEventHandlers("testEvent")).toBe(false);
		});

		test("returns false for event that was never accessed", () => {
			const manager = new EventManager<TestEvents>();
			expect(manager.hasEventHandlers("anotherEvent")).toBe(false);
		});

		test("returns true when a handler is registered", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);

			expect(manager.hasEventHandlers("testEvent")).toBe(true);
		});

		test("returns true when multiple handlers are registered", () => {
			const manager = new EventManager<TestEvents>();
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			manager.on("testEvent", handler1);
			manager.on("testEvent", handler2);

			expect(manager.hasEventHandlers("testEvent")).toBe(true);
		});

		test("returns false after all handlers are removed", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);
			expect(manager.hasEventHandlers("testEvent")).toBe(true);

			manager.off("testEvent", handler);
			expect(manager.hasEventHandlers("testEvent")).toBe(false);
		});

		test("returns correct value for different events independently", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);

			expect(manager.hasEventHandlers("testEvent")).toBe(true);
			expect(manager.hasEventHandlers("anotherEvent")).toBe(false);
		});
	});

	describe("on", () => {
		test("registers a handler for an event", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);
			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(handler).toHaveBeenCalledTimes(1);
		});

		test("handler receives the event data", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);
			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(handler).toHaveBeenCalledWith(
				expect.objectContaining({
					eventName: "testEvent",
					data: { message: "hello" },
				})
			);
		});

		test("multiple handlers are all called", () => {
			const manager = new EventManager<TestEvents>();
			const handler1 = vi.fn();
			const handler2 = vi.fn();
			const handler3 = vi.fn();

			manager.on("testEvent", handler1);
			manager.on("testEvent", handler2);
			manager.on("testEvent", handler3);

			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(handler1).toHaveBeenCalledTimes(1);
			expect(handler2).toHaveBeenCalledTimes(1);
			expect(handler3).toHaveBeenCalledTimes(1);
		});
	});

	describe("off", () => {
		test("removes a specific handler", () => {
			const manager = new EventManager<TestEvents>();
			const handler = vi.fn();

			manager.on("testEvent", handler);
			manager.off("testEvent", handler);
			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(handler).not.toHaveBeenCalled();
		});

		test("only removes the specified handler, leaving others", () => {
			const manager = new EventManager<TestEvents>();
			const handler1 = vi.fn();
			const handler2 = vi.fn();

			manager.on("testEvent", handler1);
			manager.on("testEvent", handler2);
			manager.off("testEvent", handler1);

			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(handler1).not.toHaveBeenCalled();
			expect(handler2).toHaveBeenCalledTimes(1);
		});
	});

	describe("trigger", () => {
		test("does nothing when no handlers registered", () => {
			const manager = new EventManager<TestEvents>();

			// Should not throw
			expect(() => {
				manager.trigger(
					new Event({ eventName: "testEvent", data: { message: "hello" } })
				);
			}).not.toThrow();
		});

		test("calls handlers in registration order", () => {
			const manager = new EventManager<TestEvents>();
			const callOrder: number[] = [];

			manager.on("testEvent", () => callOrder.push(1));
			manager.on("testEvent", () => callOrder.push(2));
			manager.on("testEvent", () => callOrder.push(3));

			manager.trigger(
				new Event({ eventName: "testEvent", data: { message: "hello" } })
			);

			expect(callOrder).toEqual([1, 2, 3]);
		});
	});
});
