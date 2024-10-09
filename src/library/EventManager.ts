import { Event } from "./Event";

// type StringKeys = Extract<keyof Events, string>
export class EventManager<Events> {
	protected eventHandlers: Record<
		string,
		// TODO fix keyof Events type
		// @ts-ignore
		Array<(event: Event<keyof Events, Events[keyof Events]>) => void>
	>;

	constructor() {
		this.eventHandlers = {};
	}

	protected getEventHandlers<EventName extends keyof Events>(
		eventName: EventName & string
	): Array<(event: Event<EventName & string, Events[EventName]>) => void> {
		let eventHandlers = this.eventHandlers[eventName];

		if (eventHandlers === undefined) {
			eventHandlers = [];
			this.eventHandlers[eventName] = eventHandlers;
		}

		return eventHandlers;
	}

	/**
	 * Adds an event handler for a pre-defined event.
	 *
	 * @param {EventName} eventName - The name of the event, will match the key of the specific event.
	 * @param {(event: Event<EventName, Events[EventName]>) => void} handler - The handler function to be called when the event is triggered.
	 */
	public on<EventName extends keyof Events>(
		eventName: EventName & string,
		handler: (event: Event<EventName & string, Events[EventName]>) => void
	): void {
		let eventHandlers = this.getEventHandlers(eventName);
		eventHandlers.push(handler);
	}

	/**
	 * Removes an event handler for a pre-defined event.
	 *
	 * @param {EventName} eventName - The name of the event, will match the key of the specific event.
	 * @param {(event: Event<EventName, Events[EventName]>) => void} handler - The handler function instance to be removed.
	 */
	public off<EventName extends keyof Events>(
		eventName: EventName & string,
		handler: (event: Event<EventName & string, Events[EventName]>) => void
	) {
		let eventHandlers = this.getEventHandlers(eventName);
		eventHandlers.splice(eventHandlers.indexOf(handler), 1);
	}

	/**
	 * Triggers a pre-defined event.
	 *
	 * @param {Event<EventName, Events[EventName]>} event - The event to be triggered.
	 */
	public trigger<EventName extends keyof Events>(
		event: Event<EventName & string, Events[EventName]>
	): void {
		for (let handler of this.getEventHandlers(event.eventName)) {
			handler(event);
		}
	}
}
