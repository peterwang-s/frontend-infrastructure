import Polyfill from './polyfill';
import Ajax from './ajax';
import Support from './support';
import Tools from './tools';
import DOM from './dom';
import Debug from './debug';

Polyfill.install();

const Utils = {
    ...Support,
    ...Ajax,
    ...DOM,
    ...Tools,
    ...Debug,
};

export default Utils;
