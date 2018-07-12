import { Pro } from '@ionic/pro';
import { NgModule, ErrorHandler, Injectable, Injector} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AccueilPage } from '../pages/accueil/accueil';
import { ActualitePage } from '../pages/actualite/actualite';
import { DetailsPage } from '../pages/details/details';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';// npm install --save @angular/animations
import { PlayerPage } from '../pages/player/player';
import { PlayerPlaylistPage } from '../pages/player-playlist/player-playlist';
import { ProgrammePage } from '../pages/programme/programme';
import { PodcastsPage } from '../pages/podcasts/podcasts';
import { ContactezNousPage } from '../pages/contactez-nous/contactez-nous';
import { BlogPage } from '../pages/blog/blog';
import { PlayerpopupPage } from '../pages/playerpopup/playerpopup';
import { ContenupagePage } from '../pages/contenupage/contenupage';

import { ScrollHideDirective } from '../directives/scroll-hide/scroll-hide';
import { IframeAutoHeightDirective } from '../directives/iframeautoheight/iframeautoheight';

import { AudioStreamProvider } from '../providers/audio-stream/audio-stream';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { MusicControls } from '@ionic-native/music-controls';
import { SocialSharing } from '@ionic-native/social-sharing';
import { OneSignal } from '@ionic-native/onesignal';
import { Observable } from 'rxjs/Rx';
import { SideMenuContentComponent } from '../shared/side-menu-content/side-menu-content.component';
import { Media, MediaObject } from '@ionic-native/media';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ExtendMenuProvider } from '../providers/extend-menu/extend-menu';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

localStorage.setItem("player", "stop");
localStorage.setItem("firstclickonplayer", "oui");

Pro.init('813edd26', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    AccueilPage,
    ActualitePage,
    ProgrammePage,
    PodcastsPage,
    ContactezNousPage,
    BlogPage,
	DetailsPage,
	  PlayerPage,
PlayerPlaylistPage,
	  ContenupagePage,
	  PlayerpopupPage,
	ScrollHideDirective,
	  SideMenuContentComponent,
	   IframeAutoHeightDirective
  ],
  imports: [
	  HttpModule,
    BrowserModule,
	  BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
        preloadModules: true,
		backButtonText: 'Retour',
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    	mode: 'md',
		activator: 'ripple',
		menuType: "push",
		backButtonIcon: "ios-arrow-back"
	})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccueilPage,
    ActualitePage,
    ProgrammePage,
    PodcastsPage,
    ContactezNousPage,
    BlogPage,
	DetailsPage,
	  PlayerPage,
	  PlayerpopupPage,
PlayerPlaylistPage,
	ContenupagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	   IonicErrorHandler,
	  AudioStreamProvider,
	  SocialSharing,
	  MusicControls,
	  OneSignal,
	      Media,
	  InAppBrowser,
	  ExtendMenuProvider,
	        GoogleAnalytics,
	  {provide: ErrorHandler, useClass: MyErrorHandler}
  ]
})
export class AppModule {}