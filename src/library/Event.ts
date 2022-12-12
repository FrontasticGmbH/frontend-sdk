export class Event<
	EventName extends string = string,
	EventData extends any = void
	> {
	public eventName: EventName;
	public data: EventData;
	public isDefaultPrevented: boolean;
	public isCancelled: boolean;
	public isPropagationStopped: boolean;

	constructor(options: { eventName: EventName; data: EventData }) {
		this.eventName = options.eventName;
		this.data = options.data;

		this.isCancelled = false;
		this.isDefaultPrevented = false;
		this.isPropagationStopped = false;
	}

	public preventDefault(): void {
		this.isDefaultPrevented = true;
	}

	public cancel(): void {
		this.isCancelled = true;
	}

	public stopPropagation(): void {
		this.isPropagationStopped = true;
	}
}
