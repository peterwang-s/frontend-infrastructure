import _ from '../utils/index';
import { EventIdType } from '../utils/const';

export default function initError() {
    // let errordefo = {
    //     ei: _.eventIdentifierFactoryold(2, config.namespace)
    // };

    function formatterError(errorObj = {}) {
        if (errorObj) {
            return {
                stack: errorObj.stack,
                message: errorObj.message,
                name: errorObj.name,
            };
        }
        return {
            stack: '',
            message: '',
            name: '',
        };
    }

    // img,script,css,jsonp
    function assetErrorHandle(event) {
        try {
            // let errData = Object.assign({}, errordefo);
            // 过滤js error
            const target = event.target || event.srcElement;
            const isElementTarget =
                target instanceof HTMLScriptElement ||
                target instanceof HTMLLinkElement ||
                target instanceof HTMLImageElement;
            if (!isElementTarget) return false;

            _.analyticsCollect2({
                eventType: EventIdType.JSERROR,
                data: {
                    type: event.type,
                    target: event.target.localName,
                    outerHTML: event.target.outerHTML,
                    url: event.target.src || event.target.href,
                    message: `${event.target.outerHTML} is load error`,
                },
            });
        } catch (e) {
            window.removeEventListener('error', assetErrorHandle, true);
        }
        return true;
    }
    window.addEventListener('error', assetErrorHandle, true);

    // js
    window.onerror = function (msg, _url, line, col, error) {
        try {
            // let errData = Object.assign({}, errordefo);
            setTimeout(function () {
                const num = col || (window.event && window.event.errorCharacter) || 0;

                _.analyticsCollect2({
                    eventType: EventIdType.JSERROR,
                    data: {
                        type: 'jserror',
                        msg,
                        url: _url,
                        line,
                        col: num,
                        ...formatterError(error),
                    },
                });
            }, 0);
        } catch (e) {
            window.onerror = null;
        }
    };

    const unhandledrejectionHandle = function (e) {
        try {
            const error = e && e.reason;
            const message = error.message || '';
            const stack = error.stack || '';
            let resourceUrl;
            let line;
            let errs = stack.match(/\(.+?\)/);
            if (errs && errs.length) [errs] = errs;
            errs = errs.replace(/\w.+[js|html]/g, ($1) => {
                resourceUrl = $1;
                return '';
            });
            errs = errs.split(':');
            if (errs && errs.length > 1) line = parseInt(errs[1] || 0, 10);
            const col = parseInt(errs[2] || 0, 10);

            _.analyticsCollect2({
                eventType: EventIdType.JSERROR,
                data: {
                    type: 'unhandledrejection',
                    msg: message,
                    url: resourceUrl,
                    line: col,
                    col: line,
                    ...formatterError(e),
                },
            });
        } catch (err) {
            window.removeEventListener('unhandledrejection', unhandledrejectionHandle);
        }
    };
    window.addEventListener('unhandledrejection', unhandledrejectionHandle);

    // 重写console.error
    const oldError = console.error;
    console.error = function (e) {
        // let errData = Object.assign({}, errordefo);
        setTimeout(function () {
            _.analyticsCollect2({
                eventType: EventIdType.JSERROR,
                data: {
                    type: 'console.error',
                    message: e,
                },
            });
        }, 0);
        return oldError.apply(console, arguments);
    };
}
