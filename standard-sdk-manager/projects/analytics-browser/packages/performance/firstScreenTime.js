import _ from '../utils/index';
// import plaforms from '../platforms/index';
import Config from '../config';

const firstScreen = {
    screenHeight: document.documentElement.clientHeight,
    mutationTimeLine: [],
    baseTimes: {},
    speedScore: 0,
    _isInViewport(element) {
        const self = this;
        const { screenHeight } = self;
        let top = 0;
        top = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
        top += element.getBoundingClientRect().top;

        if (top > 0 && top < screenHeight) return true;
        return false;
    },
    customPageTime() {
        const self = this;
        const imgs = document.getElementsByTagName('img');
        let loadCount = 0;
        let loadTime = 0;

        function loadDone() {
            loadCount += 1;
            if (self._isInViewport(img)) {
                const time = new Date();
                loadTime = time > loadTime ? time : loadTime;
            }
            if (loadCount === imgs.length) {
                self.handlerCustomTime(loadTime);
            }
        }

        if (imgs.length === 0) return self.handlerCustomTime(loadTime);

        for (let i = 0; i < imgs.length; i += 1) {
            const img = imgs[i];

            if (img.complete) {
                loadDone();
            }
            imgs[i].onload = loadDone;
            imgs[i].onerror = loadDone;
        }
    },
    _countMutationTimes(elements) {
        const self = this;
        let isVisible = false;
        let domRenderTime = 0;
        let score = 1;
        const l = elements.length;

        for (let i = l - 1; i >= 0; i -= 1) {
            const node = elements[i];
            if (isVisible) {
                score += i;
            }
            if (self._isInViewport(node)) {
                isVisible = true;
                domRenderTime = Date.now();
                score += i;
            }
        }

        self.speedScore += score;
        const marker = {
            score: self.speedScore,
            date: domRenderTime - self.baseTimes.startTime,
        };
        self.mutationTimeLine.push(marker);
    },
    _listenMutations(records) {
        const self = this;
        let nodeList = [];
        const mutationAllNodes = [];
        records.forEach(function (item) {
            const addNodes = _.toArray(item.addedNodes);
            nodeList = nodeList.concat(addNodes);
        });
        function dfsTree(rootNodes) {
            while (rootNodes.length) {
                const root = rootNodes.shift();
                if (root.nodeType === window.Node.ELEMENT_NODE) {
                    mutationAllNodes.push(root);
                    if (root.children.length) {
                        dfsTree(_.toArray(root.children));
                    }
                }
            }
        }
        _.nextTick(function () {
            dfsTree(nodeList);
            self._countMutationTimes(mutationAllNodes);
        });
    },
    singlePageApplicationTime() {
        const self = this;
        const MutationObserver = _.isMutationObserver;
        // Chrome 26+, Firefox 14+, IE11, Edge, Opera 15+
        self.observer = new MutationObserver(function (records) {
            self._listenMutations(records);
        });
        const element = document.body;
        const options = {
            childList: true,
            subtree: true,
        };
        self.observer.observe(element, options);
    },
    handlerStaticPageTime() {
        const self = this;
        const { baseTimes } = self;
        const screenTime = baseTimes.domReadyTime;
        self.sendTime(screenTime);
    },
    handlerCustomTime(time) {
        const self = this;
        const { startTime } = self.baseTimes;
        if (time > 0) {
            self.sendTime(time - startTime);
        } else {
            self.handlerStaticPageTime();
        }
    },
    sendTime(screenTime) {
        let time;
        // const huamiAnalytics = plaforms.huami;

        if (_.isArray(screenTime)) {
            if (!screenTime.length) return;
            time = screenTime[screenTime.length - 1].date;
        } else {
            time = screenTime;
        }
        // huamiAnalytics.trackFMP(time);

        if (time <= 0) {
            _.trackFMP(this.baseTimes.firstPaintTime);
        } else {
            _.trackFMP(time);
        }
    },
    run(baseTimes) {
        const { config } = Config.singleton();
        if (!config.autoFMP) {
            return;
        }
        const self = this;
        self.baseTimes = baseTimes;

        if (config.isSPA) {
            self.singlePageApplicationTime();
            _.delay(function () {
                self.sendTime(self.mutationTimeLine);
                if (self.observer) {
                    self.observer.disconnect();
                    self.observer.takeRecords();
                }
            }, 5000);
        } else {
            self.customPageTime();
        }
    },
};
export default firstScreen;
