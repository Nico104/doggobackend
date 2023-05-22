import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Import firebase-admin
import * as admin from 'firebase-admin';
import { ServiceAccount } from "firebase-admin";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Firebase config

  // Set the config options
  // const adminConfig: ServiceAccount = {
  //   "projectId": configService.get<string>('FIREBASE_PROJECT_ID'),
  //   "privateKey": configService.get<string>('FIREBASE_PRIVATE_KEY')
  //     .replace(/\\n/g, '\n'),
  //   "clientEmail": configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  // };
  // const path = require('path');
  //TODO dont forget to chnage path in prod
  //https://console.firebase.google.com/u/0/project/finma-dbc70/settings/serviceaccounts/adminsdk
  var serviceAccount = require("C:/Users/lepups/Documents/Doggostuff/Code/Server/finma-dbc70-firebase-adminsdk-b2ixq-f1d692a70e.json");
  // Initialize the firebase admin app
  // admin.initializeApp({
  //   credential: admin.credential.cert(adminConfig),
  //   databaseURL: "https://xxxxx.firebaseio.com",
  // });
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  //Firebase config END

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
