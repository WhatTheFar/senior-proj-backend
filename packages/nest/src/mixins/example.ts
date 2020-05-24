import { applyMixins } from './mixins';

// tslint:disable: max-classes-per-file

// Disposable Mixin
class Disposable {
	public isDisposed: boolean;
	public dispose() {
		this.isDisposed = true;
	}
}

// Activatable Mixin
class Activatable {
	public isActive: boolean;
	public activate() {
		this.isActive = true;
	}
	public deactivate() {
		this.isActive = false;
	}
}

class SmartObject {
	constructor() {
		setInterval(() => console.log(this.isActive + ' : ' + this.isDisposed), 500);
	}

	public interact() {
		this.activate();
	}
}

interface SmartObject extends Disposable, Activatable {}
applyMixins(SmartObject, [Disposable, Activatable]);

const smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
