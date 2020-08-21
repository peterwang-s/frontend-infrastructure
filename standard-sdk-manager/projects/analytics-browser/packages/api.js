const regionMap = {
    '1': {
        code: 'cn',
        name: '中国',
    },
    '2': {
        code: 'us',
        name: '美国',
    },
    '3': {
        code: 'sg',
        name: '新加坡',
    },
    '4': {
        code: 'de',
        name: '德国',
    },
    '5': {
        code: 'ru',
        name: '俄罗斯',
    },
    '6': {
        code: 'in',
        name: '印度',
    },
};

const HOST = {
    dev: 'https://api-analytics-test.huami.com/api/',
    'cn-pro': 'https://web-analytics-cn.huami.com/api/',
    'us-pro': 'https://web-analytics-us.huami.com/api/',
    'sg-pro': 'https://web-analytics-sg.huami.com/api/',
    'de-pro': 'https://web-analytics-de.huami.com/api/',
    'ru-pro': 'https://web-analytics-ru.huami.com/api/',
    'in-pro': 'https://web-analytics-in.huami.com/api/',
};

function getEnv() {
    try {
        let ureg = '';
        let country = '';
        const ua = (navigator && navigator.userAgent && navigator.userAgent.toLowerCase()) || '';
        if (ua.indexOf('userregion') > -1 && ua.match(/userregion\/(\S{0,})/)) {
            [ureg] = ua.match(/userregion\/(\S{0,})/);
        }

        if (ureg !== '') {
            if (Number(ureg) === 1 || ureg === 'cn') {
                country = '';
            } else {
                const obj = regionMap[ureg];
                country = obj ? obj.code : 'cn';
            }
        }
        return {
            dev: HOST.dev,
            pro: country ? HOST[`${country}-pro`] : HOST['cn-pro'],
        };
    } catch (e) {
        return {
            dev: HOST.dev,
            pro: HOST['cn-pro'],
        };
    }
}

export default getEnv();
