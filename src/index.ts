'use strict';

/**
 * Imports
 */
import Subject from './subject';

/**
 * Interfaces
 */
export interface StoreOptions {
	reducer: any,
	state: object,
	subjects: object
}

export interface StorePlugin {
	pluginName: string,
	initialize: any
}

/**
 * Internal data management
 */
let store;
let internalState = {};
let internalReducer = (action?: string, payload?: any) => {
};
let internalSubjects = {};

/**
 * Broadcast functions
 */
function broadcastAll(subjects: object = internalSubjects): void {
	Object.keys(subjects).forEach(subject => {
		subjects[subject].next(internalState[subject]);
	});
}

function broadcast(subject): void {
	internalSubjects[subject].next(internalState[subject]);
}

/**
 * Configure store
 */
function configure(reducer, state, subjects) {
	internalState = state;
	internalReducer = reducer;
	internalSubjects = subjects;
}

/**
 * Internal store class
 */
class AppStore {
	constructor(reducer, state, subjects) {
		configure(reducer, state, subjects);
		console.log('Store initialized!');
	}

	subscribe(observer) {
		Object.keys(internalSubjects).forEach(subject => {
			internalSubjects[subject].subscribe(observer);
			observer.next(internalState[subject]);
		});
	}

	unsubscribe(observer) {
		Object.keys(internalSubjects).forEach(subject => {
			internalSubjects[subject].unscribe(observer);
		});
	}

	select(subtype) {
		return internalSubjects[subtype];
	}

	dispatch(action, payload) {
		internalReducer(action, payload);
	}
}

/**
 * Plugin
 */
const VeamsStore: StorePlugin = {
	pluginName: 'Store',
	initialize: function (Veams, {reducer, state, subjects}: StoreOptions) {
		store = new AppStore(reducer, state, subjects);
	}
};

/**
 * Exports
 */
export { broadcast, broadcastAll, internalState as state, store, Subject };
export default VeamsStore;
