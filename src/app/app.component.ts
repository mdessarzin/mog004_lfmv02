// Angular
import { Component }  from '@angular/core';
import { Platform, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AudioStreamProvider } from '../providers/audio-stream/audio-stream';
import * as $ from "jquery";
import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { MusicControls } from '@ionic-native/music-controls';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	rootPage: any = TabsPage;

	constructor(private platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		private alertCtrl: AlertController,
		public _player: AudioStreamProvider,
		public modalCtrl: ModalController
	) {
		//this._player.playerconfigProvider('live', '0');
		//this._player.playProvider();
		//this._player.pauseProvider();
		//localStorage.setItem("build", "1.0.4");
		//this.initializeApp();
		//let ratio = Math.max(window.devicePixelRatio || 1, 1);
		//this.splashScreen.hide();
		this.platform.ready().then(() => {
			console.log('démarrage ok');
			this.splashScreen.hide();
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

	private handlerNotifications() {
/*
		this.oneSignal.startInit('7f79900f-f206-4340-8fdc-a57bc809b127', '555413916773');
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
		*/
	}

}
