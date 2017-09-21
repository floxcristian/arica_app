import { AuthData } from './../providers/auth-data';
import { TourismDetailsPage } from './../pages/tourism-details/tourism-details';
import { TourismCategoriesPage } from './../pages/tourism-categories/tourism-categories';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { OneSignal } from '@ionic-native/onesignal';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { GoogleMaps } from '@ionic-native/google-maps';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

export const firebaseConfig = {
  apiKey: "AIzaSyAnfhMJ-bRE066SRZpLVf3KaKMUh02QaRo",
    authDomain: "smartcity-a75b8.firebaseapp.com",
    databaseURL: "https://smartcity-a75b8.firebaseio.com",
    projectId: "smartcity-a75b8",
    storageBucket: "smartcity-a75b8.appspot.com",
    messagingSenderId: "802635265304"
};

@NgModule({
  declarations: [
    MyApp,
    TourismCategoriesPage,
    TourismDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TourismCategoriesPage,
    TourismDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    OneSignal,
    Keyboard,
    GoogleMaps,
    Geolocation,
    YoutubeVideoPlayer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthData,
  ]
})
export class AppModule {}
