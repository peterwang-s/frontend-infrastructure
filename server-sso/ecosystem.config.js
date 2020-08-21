module.exports = {
    apps : [{
        name: 'server-sso',
        script: './server/entry.js',
        mode:'cluster',
        instances: 1,
        autorestart: true,
        watch: true, // 开发环境设置，线上避免此设置防止造成性能开销
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
        },
        env_test: {
            NODE_ENV: 'test',
        },
        env_production: {
            NODE_ENV: 'production',
        }
    }],
};
