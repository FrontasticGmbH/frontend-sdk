type BasicTypes = string | number | boolean;

type AcceptedQueryTypes = {
	[key: string]: BasicTypes | Array<BasicTypes>;
};

export { AcceptedQueryTypes };
