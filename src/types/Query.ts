type BasicTypes = string | number | boolean;

type AcceptedQueryValueTypes =
	| BasicTypes
	| AcceptedQueryValueTypes[]
	| {
			[key: string]: AcceptedQueryValueTypes;
	  };

type AcceptedQueryTypes = {
	[key: string]: AcceptedQueryValueTypes;
};

export { AcceptedQueryValueTypes, AcceptedQueryTypes };
