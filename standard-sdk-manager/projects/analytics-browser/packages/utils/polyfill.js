const Polyfill = {
    isSupportHistory: !!(window.history && window.history.pushState),
    proxyHistoryState() {
        const _wr = function (type) {
            const orig = window.history[type];
            return function () {
                const rv = orig.apply(this, arguments);
                const e = new window.Event(type.toLowerCase());
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };

        window.history.pushState = _wr('pushState');
        window.history.replaceState = _wr('replaceState');
    },
    history() {
        if (this.isSupportHistory) {
            this.proxyHistoryState();
        }
    },
    install() {
        this.history();
    },
};

export default Polyfill;
