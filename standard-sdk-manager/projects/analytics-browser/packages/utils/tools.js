const Tools = {
    nextTick(fn) {
        this.delay(fn, 0);
    },
    // delay(func, wait) {
    delay() {
        return setTimeout.apply(window, arguments);
    },
    isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    },
    assign(obj1, obj2) {
        const target = obj1;
        for (const name in obj2) {
            if ({}.hasOwnProperty.call(obj2, name)) {
                target[name] = obj2[name];
            }
        }
        return target;
    },
    toArray(nodelist) {
        if (Array.from) return Array.from(nodelist);
        const array = [];
        for (let i = 0; i < nodelist.length; i += 1) {
            array[i] = nodelist[i];
        }
        return array;
    },
    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    uuid: (function () {
        const time = `${new Date().getTime()}-`;
        let i = 0;
        return function () {
            i += 1;
            return time + i;
        };
    })(),
    debounce(fn, delay) {
        let timer;
        return function () {
            const _this = this;
            const args = arguments;
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                fn.apply(_this, args);
            }, delay);
        };
    },
};
export default Tools;
