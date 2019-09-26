import { applyMixins } from './mixins';

// tslint:disable: max-classes-per-file

// Disposable Mixin
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}

// Activatable Mixin
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

class SmartObject {
  constructor() {
    setInterval(
      () => console.log(this.isActive + ' : ' + this.isDisposed),
      500,
    );
  }

  interact() {
    this.activate();
  }
}

interface SmartObject extends Disposable, Activatable {}
applyMixins(SmartObject, [Disposable, Activatable]);

const smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
