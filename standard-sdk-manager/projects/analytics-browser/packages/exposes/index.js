import _ from '../utils/index';
import { EventIdType } from '../utils/const';

// const exposeCatch = [];
export default function initExpose() {
    function isInViewPort(element) {
        try {
            const viewWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewHeight = window.innerHeight || document.documentElement.clientHeight;
            const { top, right, bottom, left } = element.getBoundingClientRect();

            return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
        } catch (error) {
            console.log('hmrp err');
        }
    }

    const scrollExposeHandle = _.debounce(() => {
        document.querySelectorAll('.hmrp-expose') &&
            document.querySelectorAll('.hmrp-expose').forEach((value) => {
                if (isInViewPort(value) && value.dataset.$hmex) {
                    _.analyticsCollect2({
                        eventType: EventIdType.COMMON,
                        // eslint-disable-next-line no-useless-escape
                        data: JSON.parse(value.dataset.$hmex.replace(/\'/g, '"')),
                        info: { action: 'expose_C' },
                    });
                }
            });
    }, 3000);

    window.addEventListener('scroll', function () {
        try {
            scrollExposeHandle();
        } catch (error) {
            console.log('hmrp err');
        }
    });
}
