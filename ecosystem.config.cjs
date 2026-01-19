// PM2 Ecosystem Configuration for DeepMine AI
module.exports = {
  apps: [
    {
      name: 'deepmine-ai',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=deepmine-production --r2=deepmine-kyc-documents --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}
