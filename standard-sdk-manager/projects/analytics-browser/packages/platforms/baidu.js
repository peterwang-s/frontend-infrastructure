import _ from '../utils/index';

class Baidu {
    bootstrap({ debug, siteId }) {
        this.debug = debug;
        this.siteId = siteId;
        window._hmt = window._hmt || [];
        const hm = document.createElement('script');
        hm.src = `//hm.baidu.com/hm.js?${siteId}`;
        const s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(hm, s);
    }

    _trackPageview() {
        const pageURL = window.location.pathname + window.location.hash;
        _.nextTick(function () {
            window._hmt.push(['_trackPageview', pageURL, '']);
        });
    }

    _trackEvent(data) {
        const { debug } = this;
        const type = data[0];
        const category = data[1];
        const action = data[2];
        const optLabel = data[3];
        const optValue = data[4].opt_value || '';

        if (!category && debug) {
            _.warn('category can not be empty');
        }

        if (!action && debug) {
            _.warn('action can not be empty');
        }

        if (!optLabel && debug) {
            _.warn('opt_label can not be empty');
        }

        const event = [type, category, action, optLabel, optValue];
        window._hmt.push(event);
    }
}
export default Baidu;
