module.exports = {
  apps : [{
    name: 'watchtower-monitor',
    script: './src/server-evolve.js',
    // args: 'one two',
    mode:'cluster',
    instances: 4,
    autorestart: true,
    watch: false,
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
