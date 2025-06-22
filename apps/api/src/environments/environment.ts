export const environment = {
  production: false,
  api: {
    port: 3000,
    prefix: 'api',
  },
  database: {
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
  },
  plugins: {
    path: './plugins',
    autoLoad: true,
  },
};