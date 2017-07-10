import { argv } from 'yargs'
// import environments from './environments'

const config = {
  env: process.env.NODE_ENV || 'development',

  custom_globals: {},
}

config.globals = {
  'process.env': {
    NODE_ENV  : JSON.stringify(config.env),
    DEBUG_PROD: JSON.stringify(process.env.DEBUG_PROD || 'false'),
  },
  NODE_ENV     : config.env,
  __DEV__      : config.env === 'development',
  __PROD__     : config.env === 'production',
  __TEST__     : config.env === 'test',
  __DEBUG__    : config.env === 'development' && !argv.no_debug,
}

/*const overrides = environments[config.env]
 if (overrides) {
 Object.assign(config, overrides(config))
 }*/

export default config
