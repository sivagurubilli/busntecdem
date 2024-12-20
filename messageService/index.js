const { pipe, Subject } = require('rxjs');
const { map, filter, scan } = require('rxjs/operators');
const subject = new Subject();

// Context - patient_banner, parent_child, actions

const messageService = {
    sendMessage: (
        senderId,
        message = {},
        target,
    ) => subject.next({
        text: message,
        senderId: senderId,
        target: target,
    }),
    clearMessages: () => subject.next(),
    onMessage: () => subject.asObservable().pipe(filter(m => m)),
};
module.exports = messageService