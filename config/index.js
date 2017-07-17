import path from 'path'
import { argv } from 'yargs'
import environments from './environments'

const base = (...args) => Reflect.apply(path.resolve, null, [path.resolve(__dirname, '..'), ...args])

const config = {
  env: process.env.NODE_ENV || 'development',

  custom_globals: {},

  dir_src : 'app',
  dir_dll : 'dll',
  dir_dist: 'app/dist',
  dir_test: 'tests',

  open_analyzer: process.env.OPEN_ANALYZER === 'true' || false,
  start_hot    : process.env.START_HOT || false,
  dev_port     : process.env.PORT || 1212,
}

config.utils_paths = {
  base,
  src : base.bind(null, config.dir_src),
  dll : base.bind(null, config.dir_dll),
  dist: base.bind(null, config.dir_dist),
  test: base.bind(null, config.dir_test),
}

config.globals = {
  'process.env': {
    NODE_ENV  : JSON.stringify(config.env),
    DEBUG_PROD: JSON.stringify(process.env.DEBUG_PROD || 'false'),
  },
  NODE_ENV     : config.env,
  __PROD__     : config.env === 'production',
  __DEV__      : config.env === 'development',
  __TEST__     : config.env === 'test',
  __DEBUG__    : config.env === 'development' && !argv.no_debug,
}

const overrides = environments[config.env]

if (overrides) {
  Object.assign(config, overrides(config))
}

export default config
