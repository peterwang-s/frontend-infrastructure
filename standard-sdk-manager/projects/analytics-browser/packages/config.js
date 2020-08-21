import HOST from './api';

export function getBrowser() {
    const scr = window.screen;
    return {
        userAgent: window.navigator.userAgent,
        url: window.location.href,
        title: document.title,
        screenSize: `${scr.width}x${scr.height}`,
        referer: window.location.hostname ? window.location.hostname : '',
        host: `${window.location.protocol}//${window.location.hostname}`,
    };
}

export function assign(obj1, obj2) {
    const target = obj1;
    for (const name in obj2) {
        if ({}.hasOwnProperty.call(obj2, name)) {
            target[name] = obj2[name];
        }
    }
    return target;
}

let _instance = null;

export default class Config {
    constructor(options) {
        this.config = {
            usid: '', // 标识用户id
            host: '', // 接口地址
            debug: false, // 切换测试环境
            platform: '', // 使用的平台 比如baidu
            namespace: '', // 华米category
            isSPA: true, // 应用类型
            autoPushPV: false, // 是否自动打点PV
            autoFMP: false, // 是否自动采集首屏数据
            autoOPT: false, // 是否自动采集页面停留时间
            autoExpo: false, // 是否自动采集曝光打点
            version: '1.2.8',
            publish: '1.2.8.12',
            clients: [],
            ready() {}, // 脚本加载完毕
        };

        this.config.browser = getBrowser();
        if (options) {
            this.assignConfig(options);
        }
    }

    assignConfig(options) {
        const cfs = assign(this.config, options);
        if (!cfs.host) {
            if (cfs.debug) {
                cfs.host = HOST.dev;
            } else {
                cfs.host = HOST.pro;
            }
        }
        this.config = cfs;
    }

    // get (name) {
    //   return this.config[name]
    // }

    // set (name, value) {
    //   this.config[name] = value
    //   return this.config[name]
    // }

    static singleton(options) {
        if (!_instance || options) {
            _instance = new Config(options);
        }
        return _instance;
    }

    static refresh(options) {
        _instance = new Config(options);
        return _instance;
    }

    static destory() {
        _instance = null;
    }
}
