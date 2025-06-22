export const environment = {
  production: true,
  api: {
    port: parseInt(process.env['PORT'] || '3000'),
    prefix: 'api',
  },
  database: {
    type: process.env['DB_TYPE'] || 'postgres',
    host: process.env['DB_HOST'] || 'localhost',
    port: parseInt(process.env['DB_PORT'] || '5432'),
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_DATABASE'],
    synchronize: false,
    logging: false,
  },
  plugins: {
    path: './plugins',
    autoLoad: true,
  },
};