const Debug = {
    warn: (msg) => {
        if (typeof console !== 'undefined') {
            console.error(`[HM_Analytics warn]: ${msg}`);
        }
    },
};
export default Debug;
