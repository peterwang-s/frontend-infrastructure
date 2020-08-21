(function (global, doc, type, url, namespace) {
    const startTime = 'pageStartTime';
    const globalAnalytics = 'HuamiBrowserAnalytics';
    global[startTime] = Date.now();
    global[globalAnalytics] = {
        config: {},
        queue: [],
    };
    global[namespace] = {
        init(config) {
            global[globalAnalytics].config = config;
        },
        push(data) {
            global[globalAnalytics].queue.push(data);
        },
    };
    if ('PerformanceLongTaskTiming' in window) {
        window.__tti = {
            e: [],
        };
        const g = window.__tti;
        g.o = new PerformanceObserver(function (l) {
            g.e = g.e.concat(l.getEntries());
        });
        g.o.observe({
            entryTypes: ['longtask'],
        });
    }
    const script = doc.createElement(type);
    function handleReady() {
        const { readyState } = script;
        if (
            typeof readyState === 'undefined' ||
            readyState === 'loaded' ||
            readyState === 'complete'
        ) {
            try {
                window[namespace] = window.Analytics;
                if (window[namespace]) window[namespace].ready();
            } finally {
                script.onload = null;
                script.onreadystatechange = null;
            }
        }
        script.onreadystatechange = null;
    }
    script.onload = handleReady;
    script.onreadystatechange = handleReady;
    script.async = true;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.head.appendChild(script);
})(
    typeof window !== 'undefined' ? window : this,
    document,
    'script',
    'https://aos-testing.cdn.bcebos.com/0.0.11/analytics.min.js',
    'HM_Analytics',
);
