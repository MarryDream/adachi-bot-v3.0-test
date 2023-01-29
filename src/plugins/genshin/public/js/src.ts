import axios, { AxiosRequestConfig } from "axios";

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

export async function request( url: string, params: Record<string, any> = {}, method: "get" | "post" | "put" | "delete" = "get" ) {
	const reqObj: AxiosRequestConfig = {
		url: url,
		baseURL: "/genshin",
		method,
		responseType: "json",
		timeout: 60000
	}
	if ( method === "get" || method === "delete" ) {
		reqObj.params = params;
	} else {
		reqObj.data = params;
	}
	const res = await axios( reqObj );
	return res.data;
}

export function getFullDate() {
	const date = new Date();
	let hour: string | number = date.getHours();
	let minute: string | number = date.getMinutes();
	let second: string | number = date.getSeconds();
	second = second < 10 ? "0" + second : second;
	minute = minute < 10 ? "0" + minute : minute;
	hour = hour < 10 ? "0" + hour : hour;
	
	return `${ date.getMonth() + 1 }月${ date.getDate() }日 ${ hour }:${ minute }:${ second }`;
}