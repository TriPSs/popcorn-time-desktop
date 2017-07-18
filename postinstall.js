// @flow
import os from 'os'
import path from 'path'
import extract from 'extract-zip'
import debug from 'debug'

const log     = debug('app:postinstall')
const baseDir = path.join(__dirname, 'node_modules', 'electron', 'dist')

function getUrl(): { platform: string, dest: string } {
  switch (os.type()) {
    case 'Darwin':
      return {
        platform: 'osx',
        dest    : path.join(
          baseDir,
          'Electron.app',
          'Contents',
          'Frameworks',
          'Electron Framework.framework',
          'Libraries',
        ),
      }
    case 'Windows_NT':
      return {
        platform: 'win',
        dest    : baseDir,
      }
    case 'Linux':
      return {
        platform: 'linux',
        dest    : baseDir,
      }
    default:
      return {
        platform: 'linux',
        dest    : baseDir,
      }
  }
}

function setupFfmpeg() {
  const { platform, dest } = getUrl()
  const zipLocation        = path.join(
    __dirname,
    'ffmpeg',
    `0.23.5-${platform}-${os.arch()}.zip`,
  )

  log('--> Replacing ffmpeg...')

  extract(zipLocation, { dir: dest }, (error) => {
    if (error) {
      log(error)
    }
  })
}

setupFfmpeg()
