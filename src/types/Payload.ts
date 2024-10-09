type AcceptedPayloadValueTypes =
	| unknown
	| AcceptedPayloadValueTypes[]
	| {
			[key: string]: AcceptedPayloadValueTypes;
	  };

type AcceptedPayloadTypes = {
	[key: string]: AcceptedPayloadValueTypes;
};

export { AcceptedPayloadValueTypes, AcceptedPayloadTypes };
