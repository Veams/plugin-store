'use strict';
import Subject from './subject';

let store;
let internalState = {};
let internalReducer = () => {
};
let internalSubjects = {};

/**
 * Broadcast functions
 */
function broadcastAll(subjects) {
	Object.keys(subjects).forEach(subject => {
		subject.next(internalState[subject]);
	});
}

function broadcast(subject) {
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
const VeamsStore = {
	pluginName: 'Store',
	initialize: function (Veams, {reducer, state, subjects}) {
		store = new AppStore(reducer, state, subjects);
	}
};

/**
 * Exports
 */
export {broadcast, broadcastAll, internalState as state, store, Subject};
export default VeamsStore;
