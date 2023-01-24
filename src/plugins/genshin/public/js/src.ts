export function parseURL( url ): Record<string, string> {
	let urlParams = url.substring( 1 ).split( "&" );
	let result = {};
	for ( let p of urlParams ) {
		const [ key, value ] = p.split( "=" );
		result[key] = value;
	}
	return result;
}

export function request( url: string ) {
	const Http = new XMLHttpRequest();
	Http.open( "GET", `/genshin${ url }`, false );
	Http.send();
	return JSON.parse( Http.responseText );
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