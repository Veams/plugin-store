(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("index", [], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = root["index"] || {}, root["index"]["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Subject = exports.store = exports.state = exports.broadcastAll = exports.broadcast = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _subject = __webpack_require__(1);
	
	var _subject2 = _interopRequireDefault(_subject);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var store = void 0;
	var internalState = {};
	var internalReducer = function internalReducer() {};
	var internalSubjects = {};
	
	/**
	 * Broadcast functions
	 */
	function broadcastAll(subjects) {
		Object.keys(subjects).forEach(function (subject) {
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
		exports.state = internalState = state;
		internalReducer = reducer;
		internalSubjects = subjects;
	}
	
	/**
	 * Internal store class
	 */
	
	var AppStore = function () {
		function AppStore(reducer, state, subjects) {
			_classCallCheck(this, AppStore);
	
			configure(reducer, state, subjects);
			console.log('Store initialized!');
		}
	
		_createClass(AppStore, [{
			key: 'subscribe',
			value: function subscribe(observer) {
				Object.keys(internalSubjects).forEach(function (subject) {
					internalSubjects[subject].subscribe(observer);
					observer.next(internalState[subject]);
				});
			}
		}, {
			key: 'unsubscribe',
			value: function unsubscribe(observer) {
				Object.keys(internalSubjects).forEach(function (subject) {
					internalSubjects[subject].unscribe(observer);
				});
			}
		}, {
			key: 'select',
			value: function select(subtype) {
				return internalSubjects[subtype];
			}
		}, {
			key: 'dispatch',
			value: function dispatch(action, payload) {
				internalReducer(action, payload);
			}
		}]);
	
		return AppStore;
	}();
	
	/**
	 * Plugin
	 */
	
	
	var VeamsStore = {
		pluginName: 'Store',
		initialize: function initialize(Veams, _ref) {
			var reducer = _ref.reducer,
			    state = _ref.state,
			    subjects = _ref.subjects;
	
			exports.store = store = new AppStore(reducer, state, subjects);
		}
	};
	
	/**
	 * Exports
	 */
	exports.broadcast = broadcast;
	exports.broadcastAll = broadcastAll;
	exports.state = internalState;
	exports.store = store;
	exports.Subject = _subject2.default;
	exports.default = VeamsStore;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Subject = function () {
		function Subject() {
			_classCallCheck(this, Subject);
	
			this.observers = [];
		}
	
		_createClass(Subject, [{
			key: "subscribe",
			value: function subscribe(obs) {
				this.observers.push(obs);
			}
		}, {
			key: "unsubscribe",
			value: function unsubscribe(obs) {
				var _this = this;
	
				this.observers.forEach(function (observer, idx) {
					if (observer === obs) {
						_this.observers.splice(idx, 1);
					}
				});
			}
		}, {
			key: "next",
			value: function next(data) {
				this.observers.forEach(function (obs) {
					return obs.next(data);
				});
			}
		}]);
	
		return Subject;
	}();
	
	exports.default = Subject;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map