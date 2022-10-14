import Event from "./Event";
import SimpleEmitter from "./SimpleEmitter";

export default class EnhancedEmitter<
	Events extends {},
	Hooks extends {},
	EventsAndHooks extends Events & Hooks = Events & Hooks
> {
	protected eventHandle: SimpleEmitter<EventsAndHooks>;
	protected beforeHandle: SimpleEmitter<Hooks>;
	protected afterHandle: SimpleEmitter<Hooks>;

	constructor() {
		this.eventHandle = new SimpleEmitter();
		this.beforeHandle = new SimpleEmitter();
		this.afterHandle = new SimpleEmitter();
	}

	public trigger<EventName extends keyof EventsAndHooks>(eventOptions: {
		eventName: EventName;
		data: EventsAndHooks[EventName];
	}): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		let event = new Event(eventOptions);
		this.eventHandle.triggerHandlers(event);

		return this;
	}

	public on<EventName extends keyof EventsAndHooks>(
		eventName: EventName,
		handler: (event: Event<EventName, EventsAndHooks[EventName]>) => void
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.eventHandle.addHandler(eventName, handler);

		return this;
	}

	public off<EventName extends keyof EventsAndHooks>(
		eventName: EventName
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.eventHandle.removeHandlersForEvent(eventName);

		return this;
	}

	public offHandler<EventName extends keyof EventsAndHooks>(
		eventName: EventName,
		handler: (event: Event<EventName, EventsAndHooks[EventName]>) => void
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.eventHandle.removeHandler(eventName, handler);
		return this;
	}

	public offAllEvents(): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.eventHandle.removeAllHandlers();

		return this;
	}

	public before<HookName extends keyof Hooks>(
		eventName: HookName,
		handler: (event: Event<HookName, Hooks[HookName]>) => void
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.beforeHandle.addHandler(eventName, handler);

		return this;
	}

	public offBefore<HookName extends keyof Hooks>(
		eventName: HookName
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.beforeHandle.removeHandlersForEvent(eventName);

		return this;
	}

	public after<HookName extends keyof Hooks>(
		eventName: HookName,
		handler: (event: Event<HookName, Hooks[HookName]>) => void
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.afterHandle.addHandler(eventName, handler);

		return this;
	}

	public offAfter<HookName extends keyof Hooks>(
		eventName: HookName
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		this.afterHandle.removeHandlersForEvent(eventName);

		return this;
	}

	public provideHook<HookName extends keyof Hooks>(
		eventOptions: {
			eventName: HookName;
			data: EventsAndHooks[HookName];
		},
		defaultHandler: (event: Event<HookName, Hooks[HookName]>) => void
	): EnhancedEmitter<Events, Hooks, EventsAndHooks> {
		let event = new Event(eventOptions);

		this.beforeHandle.triggerHandlers(event);

		if (!(event.isCancelled || event.isDefaultPrevented)) {
			defaultHandler.call(this, event);
		}

		// event might have been changed by defaultHandler
		if (!event.isCancelled) {
			this.eventHandle.triggerHandlers(event);
		}

		// event might have been changed by handlers
		if (!event.isCancelled) {
			this.afterHandle.triggerHandlers(event);
		}

		return this;
	}
}
