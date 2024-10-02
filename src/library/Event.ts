/**
 * The class represeting the Event type to be passed to the EventManager's trigger function.
 *
 * @param {EventName} EventName - The name of the event being created, will match the key of the specific event.
 * @param {EventData} EventData - The data associated with the event being created, will match the value of the specific event and be the parameter supplied to the event handler.
 */
export class Event<
	EventName extends string = string,
	EventData extends any = void
> {
	/**
	 * The name of the event, will match the key of the specific event.
	 */
	public eventName: EventName;
	/**
	 * The data associated with the event, will match the value of the specific event and be the parameter supplied to the event handler.
	 */
	public data: EventData;

	/**
	 * Contructor.
	 *
	 * @param {EventName} options.eventName - The name of the event being created, will match the key of the specific event.
	 * @param {EventData} options.data - The data associated with the event being created, will match the value of the specific event and be the parameter supplied to the event handler.
	 */
	constructor(options: { eventName: EventName; data: EventData }) {
		this.eventName = options.eventName;
		this.data = options.data;
	}
}
