// Angular
import { Component, ViewChild } from '@angular/core';

// RxJS
import { ReplaySubject } from "rxjs/ReplaySubject";
//import { ArrayObservable } from "rxjs/observable/ArrayObservable";

// Ionic
import { Platform, MenuController, AlertController, ModalController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Side Menu Component
import { OneSignal } from '@ionic-native/onesignal';
import { AudioStreamProvider } from '../providers/audio-stream/audio-stream';
import * as $ from "jquery";
import { TabsPage } from '../pages/tabs/tabs';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	rootPage: any = TabsPage;

	constructor(private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private alertCtrl: AlertController,
		private menuCtrl: MenuController,
		private oneSignal: OneSignal,
		public _player: AudioStreamProvider,
		public modalCtrl: ModalController
	) {
		this._player.playerconfigProvider('live', '0');
		//this._player.playProvider();
		//this._player.pauseProvider();
		localStorage.setItem("build", "1.0.4");
		this.initializeApp();



		let ratio = Math.max(window.devicePixelRatio || 1, 1);
	}

	initializeApp() {
		this.platform.ready().then(() => {

			

			this.statusBar.styleDefault();
			this.splashScreen.hide();
			localStorage.setItem("type_player", "live");
			localStorage.setItem("podcast_url", '');
			localStorage.setItem("player", "stop");
			localStorage.setItem("player_url", 'https://lausannefm.ice.infomaniak.ch/lausannefm-high.mp3');
			localStorage.setItem("player_title", 'Direct');
			localStorage.setItem("player_json", 'https://www.mediaone-digital.ch/cache/lfm.json');

			$.getJSON('https://www.mediaone-digital.ch/cache/live/lfm_live.json', function (data) {
				localStorage.setItem("playerDetail", data.start_short + '-' + data.end_short);
				localStorage.setItem("playerTitre", data.title);
				localStorage.setItem("playerSoustitre", data.animators);
				localStorage.setItem("playerCover", data.picture); //data.picture
				$('#coverPlayerHome').attr('src', data.picture);
			});


			if (this.platform.is('cordova')) {
				this.handlerNotifications();
			}

			

	

			if (this.platform.is('cordova')) {

				let ratio = Math.max(window.devicePixelRatio || 1, 1);

				/*
				(<any>window).SmartAdServer.setOptions({
					siteId: 241727,
					baseUrl: 'http://mobile.smartadserver.com',
					position: (<any>window).SmartAdServer.AD_POSITION.BOTTOM_CENTER,
					// offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
					bgColor: 'black', // color name, or '#RRGGBB'
					isTesting: false, // set to true, to receiving test ad for testing purpose
					autoShow: true, // auto show interstitial ad when loaded, set to false if prepare/show
				});


				(<any>window).SmartAdServer.prepareInterstitial({
					adId: '947330/29216',
					autoShow: true
				});
*/
				console.log('Platform is ready');
			}

			setInterval(() => {
				$.ajaxSetup({ cache: false });
				$.getJSON('https://www.mediaone-digital.ch/cache/lfm.json?hash_id=' + Math.random(), function (data) {
					localStorage.setItem("songArtist", data.live[0].interpret);
					localStorage.setItem("songTitle", data.live[0].title);
					localStorage.setItem("songCover", data.live[0].imageURL);
				});

				if (localStorage.type_player == 'live') {
					$.getJSON('https://www.mediaone-digital.ch/cache/live/lfm_live.json?hash_id=' + Math.random(), function (data) {
						localStorage.setItem("playerDetail", data.start_short + '-' + data.end_short);
						localStorage.setItem("playerTitre", data.title);
						localStorage.setItem("playerSoustitre", data.animators);
						localStorage.setItem("playerCover", data.picture); //data.picture
						$('.songArtist').html(data.start_short + '-' + data.end_short);
						$('.songTitle').html(data.title);
						$('.songCover').attr('src', data.picture);
					});
				}

			}, 30000);



		});


	}


	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'Information',
			message: message,
			buttons: ['Ok']
		});
		alert.present();
	}

	private infos() {
		let alert = this.alertCtrl.create({
			title: 'Informations',
			message: 'Media One Group - Build v' + localStorage.build,
			buttons: ['Ok']
		});
		alert.present();
	}


	private handlerNotifications() {

		this.oneSignal.startInit('2bb64197-f783-46fd-9551-24de82fc9f89', '776643205654');
		this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
		//this.oneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
		this.oneSignal.handleNotificationOpened()
			.subscribe(jsonData => {
				let alert = this.alertCtrl.create({
					title: jsonData.notification.payload.title,
					subTitle: jsonData.notification.payload.body,
					buttons: ['OK']
				});
				alert.present();
				console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
			});
		this.oneSignal.endInit();
	}

}
