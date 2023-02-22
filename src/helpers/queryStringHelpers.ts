type BasicTypes = string | number | boolean;

type SupportedQueryTypes = BasicTypes | { [key: string]: BasicTypes };

type QueryInputObject = {
	[key: string]: SupportedQueryTypes | Array<SupportedQueryTypes>;
}

export const generateQueryString = function(query: QueryInputObject) {

}
