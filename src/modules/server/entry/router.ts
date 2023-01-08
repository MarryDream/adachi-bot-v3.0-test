import {
	createRouter as _createRouter,
	createMemoryHistory
} from "vue-router";

export function createRouter() {
	return _createRouter( {
		history: createMemoryHistory(),
		routes: []
	} )
}