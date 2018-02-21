# Veams Store Plugin (`@veams/plugin-store`)

A simple store implementation for Veams by using almost the same naming convention like in Redux.

It is a real simple store to solve basic problems by using:

1. Observer/Store pattern
1. A centralized store
1. A simple data object
1. A simple update method to add or modify data

For larger projects we recommend Redux. 

TypeScript is supported. 

## Installation

### NPM

``` bash 
npm install @veams/plugin-store --save
```

### Yarn 

``` bash 
yarn add @veams/plugin-store
```

## Usage

```js
import Veams from '@veams/core';
import VeamsStore from '@veams/plugin-store';

// Custom Store 
import rootReducer from './store/reducer';
import INITIAL_STATE from './store/app-state';
import subjects from "./store/subjects";

// Intialize core of Veams
Veams.onInitialize(() => {
   	// Add plugins to the Veams system
	Veams.use(VeamsStore, {
		reducer: rootReducer,
        state: INITIAL_STATE,
        subjects: subjects
	});
});
```

Let's take a look at the necessary files `reducer`, `subjects`, `app-state`.

### App State Structure (`store/app-state.js`)

The state is a simple object which contains your store structure. It is your initial state.

```js
export default {
	data: {},
	ui: {
		overlayOpen: false
	}
}
```

### Subject Structure (`store/subjects.js`)

You decide on which element you want to be able to subscribe by using the `Subject()` class. 

```js
import {Subject} from '@veams/plugin-store';

export default {
	data: new Subject(),
	ui: new Subject()
}
```

### Reducer Structure (`store/reducer.js`)

Only one reducer is possible. Be sure to broadcast all the changes to the specific observers. 

```js
import {state, broadcast} from '@veams/plugin-store';

export default function rootReducer(action, payload) {
	switch (action) {
		case 'DATA_GIPHYS_LOADED_ACTION':
			state.data = handleGiphysLoaded(state.data, payload);
			broadcast('data');
			break;

		case 'DATA_GIPHYS_CLEAR_ACTION':
			state.data = handeGiphysDeleted(state.data);
			broadcast('data');
			break;


		case 'UI_OVERLAY_OPEN_ACTION':
			state.ui = handleOverlayOpen(state.ui, payload);
			broadcast('ui');
			break;

		default:
			return state;
	}
}
```

### Component in Action 

The store will be shared as singleton out of the package itself. That's why you can easily import ...

```js
/**
 * Description of ListView.
 *
 * @module ListView
 * @version v0.0.0
 *
 * @author your_name
 */

// Imports
import Component from '@veams/component';
import HttpService from '@veams/http-services';
import { store } from "@veams/plugin-store";


// Services
const giphyService = new HttpService({
	type: 'json',
	url: '/ajax/giphys.json'
});

class ListView extends Component {
	/**
	 * Constructor for our class
	 *
	 * @see module.js
	 *
	 * @param {Object} obj - Object which is passed to our class
	 * @param {Object} obj.el - element which will be saved in this.el
	 * @param {Object} obj.options - options which will be passed in as JSON object
	 */
	constructor(obj) {
		let options = {
			overlayOpener: '[data-js-item="list-view-cta"]'
		};
		super(obj, options);
	}

	get events() {
		return {
			'click {{this.options.overlayOpener}}': 'showGif'
		}
	}

	/**
	 * Initialize the view
	 *
	 */
	initialize() {
		// Let's select the data object and subscribe to the data subject with this component
		store.select('data').subscribe(this);

        // Now we want to fetch some data from the API ... 
		giphyService
			.get()
			.then(data => {
				// After fetching data, dispatch an action with the response as payload.
				store.dispatch('DATA_GIPHYS_LOADED_ACTION', data);
				
				// Now we want to unsubscribe from the data subject.
				store.select('data').unsubscribe(this);
			});

	}

    // This function is necessary when working with the store. 
    // It provides to you the new data object when store data is changed.
	next(data) {
		if (data.giphys) {
			this.render(data.giphys);
		}
	}

	/**
	 * Render class
	 */
	render(data = {}) {
		this.$el.html(this.renderTemplate('c-list-view-tpl', data));

		return this;
	}

	showGif($evt) {
		// Here we dispatch another action 
		store.dispatch('UI_OVERLAY_OPEN_ACTION', true);
	}
}

export default ListView;
```
