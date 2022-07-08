import 'reflect-metadata';
import { config as configDev } from 'dotenv';
configDev();

import MyClient from './client/Client';

(async () => {
  await new MyClient().start();
})();
