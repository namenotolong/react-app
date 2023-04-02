const events = require('events');
const emitter = new events.EventEmitter();

function registerLister(name, func) {
    emitter.on(name, func)
}

function sendEvent(eventName, args) {
    emitter.emit(eventName, args)
}
export {registerLister, sendEvent}