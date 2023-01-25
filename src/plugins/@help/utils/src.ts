import axios from "axios";

export function parseURL( url: string ): Record<string, string> {
	try {
		const searchParams = [ ...new URL( url ).searchParams ].map( ( [ key, value ] ) => {
			return [ key, decodeURIComponent( value ) ];
		} )
		return Object.fromEntries( searchParams );
	} catch {
		return {};
	}
}

export async function request( url: string, method: "get" | "post" | "put" | "delete" = "get" ) {
	const data = await axios( {
		url: `/@help${ url }`,
		method,
		timeout: 60000
	} );
	return data.data;
}