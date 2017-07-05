// @flow
import { Client, DefaultMediaReceiver } from 'castv2-client';
import mdns from 'mdns';
import debug from 'debug'
import type {
  PlayerProviderInterface,
  deviceType,
  metadataType
} from './PlayerProviderInterface';


const log = debug('app:player:chromecast')

type castv2DeviceType = {
  fullname: string,
  addresses: Array<string>,
  port: number,
  txtRecord: {
    fn: string
  }
};

class ChromecastPlayerProvider implements PlayerProviderInterface {

  provider = 'Chromecast';

  providerId = 'chromecast';

  supportsSubtitles = true;

  selectedDevice: deviceType;

  devices: Array<deviceType> = [];

  browser: {
    on: (event: string, cb: (device: castv2DeviceType) => void) => void,
    start: () => void,
    stop: () => void
  };

  constructor() {
    this.browser = mdns.createBrowser(mdns.tcp('googlecast'));
  }

  getDevices(timeout: number = 2000) {
    return new Promise(resolve => {
      const devices = [];

      this.browser.on('serviceUp', service => {
        devices.push({
          name   : service.txtRecord.fn,
          id     : service.fullname,
          address: service.addresses[0],
          port   : service.port
        });
      });

      this.browser.start();

      setTimeout(() => {
        this.browser.stop();
        resolve(devices);
        this.devices = devices;
      }, timeout);
    });
  }

  selectDevice(deviceId: string) {
    const selectedDevice = this.devices.find(device => device.id === deviceId);
    if (!selectedDevice) {
      throw new Error('Cannot find selected device');
    }
    this.selectedDevice = selectedDevice;
    return selectedDevice;
  }

  play(contentUrl: string, item) {
    const client = new Client();

    if (!this.selectDevice) {
      throw new Error('No device selected');
    }

    return new Promise((resolve, reject) => {
      log(`Connecting to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

      client.connect(this.selectedDevice.address, () => {
        log(`Connected to: ${this.selectedDevice.name} (${this.selectedDevice.address})`)

        client.launch(DefaultMediaReceiver, (error, player) => {
          if (error) {
            reject(error);
          }

          // on close

          player.on('status', (status) => {
            log('Status broadcast playerState=%s', status.playerState);
          })

          const media = {
            // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
            contentId  : contentUrl,
            contentType: 'video/mp4',
            streamType : 'BUFFERED', // or LIVE

            // Title and cover displayed while buffering
            metadata: {
              type        : 0,
              metadataType: 0,
              title       : item.title,
              images      : [
                {
                  url: item.images.poster.full || item.images.fanart.full
                }
              ]
            }
          };

          player.load(media, { autoplay: true }, (error) => {
            if (error) {
              reject(error)
            }
            resolve();
          });
        });
      });

      client.on('error', (error) => {
        console.log('Error: %s', error.message);

        client.close();

        reject(error); //Error
      });
    });
  }
}

export default ChromecastPlayerProvider;
