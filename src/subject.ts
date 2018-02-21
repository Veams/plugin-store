export default class Subject {
	observers = [];

	subscribe(obs) {
		this.observers.push(obs);
	}

	unsubscribe(obs) {
		this.observers.forEach((observer, idx) => {
			if (observer === obs) {
				this.observers.splice(idx, 1);
			}
		});
	}

	next(data) {
		this.observers.forEach(obs => obs.next(data));
	}
}