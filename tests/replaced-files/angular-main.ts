import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { DappAngular } from './contracts/dappAngular'
import artifact from '../artifacts/dappAngular.json'

import { Scrypt, bsv } from 'scrypt-ts'

DappAngular.loadArtifact(artifact)

Scrypt.init({
  apiKey: 'testnet_3OJHoUTWnhTtVGck0T6ZpV2Cx3lcLw0UchOfl4aPtfA8D10Kf',
  network: bsv.Networks.testnet,
})

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));