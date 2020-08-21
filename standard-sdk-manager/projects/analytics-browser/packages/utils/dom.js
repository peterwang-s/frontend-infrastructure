import Support from './support';
import _ from './tools';
import { URLCHANGEEVENT } from './const';

const EVENT_VISIBILITYCHANGE = 'visibilitychange';
const EVENT_FOCUS = 'focus';
const EVENT_BLUR = 'blur';
// const EVENT_POPSTATE = 'popstate';
// const EVENT_PUSHSTATE = 'pushstate';
// const EVENT_REPLACESTATE = 'replacestate';
// const EVENT_HASHCHANGE = 'hashchange';
// const EVENT_BEFOREUNLOAD = 'beforeunload';
const EVENT_UNLOAD = 'unload';
const EVENT_PAGESHOW = 'pageshow';

const DOM = {
    getUserAgent() {
        return window.navigator.userAgent;
    },
    getBrowser() {
        const scr = window.screen;
        return {
            userAgent: window.navigator.userAgent,
            url: window.location.href,
            title: document.title,
            screenSize: `${scr.width}x${scr.height}`,
            referer: window.location.hostname ? window.location.hostname : '',
            host: `${window.location.protocol}//${window.location.hostname}`,
        };
    },
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    },
    addScript(url, callback) {
        const script = document.createElement('script');
        let scriptLoaded = 0;

        function handleScript() {
            if (scriptLoaded) {
                return;
            }
            const { readyState } = script;
            if (
                typeof readyState === 'undefined' ||
                readyState === 'loaded' ||
                readyState === 'complete'
            ) {
                scriptLoaded = 1;
                try {
                    callback();
                } finally {
                    script.onload = null;
                    script.onreadystatechange = null;
                    script.parentNode.removeChild(script);
                }
            }
        }
        script.onreadystatechange = handleScript;
        script.onload = handleScript;
        script.async = 0;
        script.src = url;
        const lastScript = document.getElementsByTagName('script')[0];
        lastScript.parentNode.insertBefore(script, lastScript);
    },
    bind(target, type, fn) {
        const obj = target;
        if (obj.addEventListener) {
            obj.addEventListener(type, fn, false);
        } else if (obj.attachEvent) {
            obj[`e${type}${fn}`] = fn;
            obj[type + fn] = function () {
                obj[`e${type}${fn}`](window.event);
            };
            obj.attachEvent(`on${type}`, obj[type + fn]);
        } else {
            obj[`on${type}`] = obj[`e${type}${fn}`];
        }
    },
    watchPageShow(show) {
        this.bind(window, EVENT_PAGESHOW, function () {
            show();
        });
    },
    watchVisibility(show, hide) {
        if (Support.isSupportVisibility) {
            this.bind(document, EVENT_VISIBILITYCHANGE, function () {
                const isHidden = document.visibilityState === 'hidden';
                if (isHidden) {
                    hide();
                } else {
                    show();
                }
            });
        } else {
            this.bind(window, EVENT_FOCUS, function () {
                show();
            });

            this.bind(window, EVENT_BLUR, function () {
                hide();
            });
        }
    },
    watchHistory(callback) {
        let originPath = window.location.href;

        function _isRerender() {
            const path = window.location.href;
            if (originPath !== path) {
                callback(originPath);
                originPath = path;
            }
        }

        if (Support.isHistoryApi) {
            URLCHANGEEVENT.forEach((EVENT) => {
                this.bind(window, EVENT, function (event) {
                    console.log(event);
                    _.delay(_isRerender, 0);
                });
            });
        }
    },
    watchBeforeUnload(callback) {
        const originPath = window.location.href;
        this.bind(window, EVENT_UNLOAD, function () {
            callback(originPath);
        });
    },
};

export default DOM;
