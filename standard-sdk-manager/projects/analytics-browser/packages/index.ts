import core from './core';

export function init(options: any) {
    const analytics = core.singleton();
    analytics.init(options);
}

export function push(options: any) {
    const analytics = core.singleton();
    analytics.push(options);
}

export function ready(options: any) {
    options;
    const analytics = core.singleton();
    analytics.ready();
}
