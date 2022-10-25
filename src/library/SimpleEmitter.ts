import Event from "./Event";

export default class SimpleEmitter<Events> {
	protected eventHandlers: Record<
		string,
		Array<(event: Event<keyof Events, Events[keyof Events]>) => void>
	>;

	constructor() {
		this.eventHandlers = {};
	}

	protected getEventHandlers<EventName extends keyof Events>(
		eventName: EventName,
	): Array<(event: Event<EventName, Events[EventName]>) => void> {
		let eventHandlers = this.eventHandlers[eventName];

		if (eventHandlers === undefined) {
			eventHandlers = [];
			this.eventHandlers[eventName] = eventHandlers;
		}

		return eventHandlers;
	}

	public addHandler<EventName extends keyof Events>(
		eventName: EventName,
		handler: (event: Event<EventName, Events[EventName]>) => void,
	): void {
		let eventHandlers = this.getEventHandlers(eventName);
		eventHandlers.push(handler);
	}

	public removeHandlersForEvent<EventName extends keyof Events>(
		eventName: EventName,
	): void {
		this.eventHandlers[eventName] = [];
	}

	public removeHandler<EventName extends keyof Events>(
		eventName: EventName,
		handler: (event: Event<EventName, Events[EventName]>) => void,
	) {
		let eventHandlers = this.getEventHandlers(eventName);
		eventHandlers.splice(eventHandlers.indexOf(handler), 1);
	}

	public removeAllHandlers() {
		this.eventHandlers = {};
	}

	public triggerHandlers<EventName extends keyof Events>(
		event: Event<EventName, Events[EventName]>,
	): void {
		for (let handler of this.getEventHandlers(event.eventName)) {
			handler(event);
		}
	}
}
