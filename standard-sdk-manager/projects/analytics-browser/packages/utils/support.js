const Support = {
    isHistoryApi: !!(window.history && window.history.pushState),
    isSendBeacon: !!navigator.sendBeacon,
    isSupportVisibility: document.visibilityState || document.webkitVisibilityState,
    isPerformance:
        window.performance ||
        window.webkitPerformance ||
        window.msPerformance ||
        window.mozPerformance,
    isMutationObserver:
        window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
    slice: Array.prototype.slice,
};
export default Support;
