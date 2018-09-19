// Angular
import { Component, ViewChild } from '@angular/core';

// RxJS
import { ReplaySubject } from "rxjs/ReplaySubject";
//import { ArrayObservable } from "rxjs/observable/ArrayObservable";

// Ionic
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';



//import { ActualitePage } from '../pages/actualite/actualite';
//import { ProgrammePage } from '../pages/programme/programme';
//import { PodcastsPage } from '../pages/podcasts/podcasts';
//import { ContactezNousPage } from '../pages/contactez-nous/contactez-nous';
import { BlogPage } from '../pages/blog/blog';
import { PodcastsPage } from '../pages/podcasts/podcasts';


import { AccueilPage } from '../pages/accueil/accueil';

// Side Menu Component
import { SideMenuContentComponent } from './../shared/side-menu-content/side-menu-content.component';
import { SideMenuSettings } from './../shared/side-menu-content/models/side-menu-settings';
import { MenuOptionModel } from './../shared/side-menu-content/models/menu-option-model';
import { OneSignal } from '@ionic-native/onesignal';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { AudioStreamProvider } from '../providers/audio-stream/audio-stream';
import { ContenupagePage } from '../pages/contenupage/contenupage';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as $ from "jquery";

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) navCtrl: Nav;

	// Get the instance to call the public methods
	@ViewChild(SideMenuContentComponent) sideMenu: SideMenuContentComponent;

	public rootPage: any = AccueilPage;

	// Options to show in the SideMenuComponent
	public options: Array<MenuOptionModel>;

	// Settings for the SideMenuComponent
	public sideMenuSettings: SideMenuSettings = {
		accordionMode: true,
		showSelectedOption: true,
		selectedOptionClass: 'active-side-menu-option',
		subOptionIndentation: {
			md: '25px',
			ios: '25px',
			wp: '25px'
		}
	};

	private unreadCountObservable: any = new ReplaySubject<number>(0);

	constructor(private platform: Platform,
				private statusBar: StatusBar,
				private splashScreen: SplashScreen,
				private alertCtrl: AlertController,
				private menuCtrl: MenuController,
				private oneSignal: OneSignal,
				public _player: AudioStreamProvider,
				private socialSharing: SocialSharing,
				) {
		this._player.playerconfigProvider();
		//this._player.playProvider();
        //this._player.pauseProvider();
		localStorage.setItem("build", "1.0.4");
		this.statusBar.backgroundColorByHexString("#29b7c2");
		this.initializeApp();	
		let ratio = Math.max(window.devicePixelRatio || 1, 1);
		

		this.showAdmobBannerAds();
		
	}
	
	showAdmobBannerAds(){
		
					 
}



	initializeApp() {
		this.platform.ready().then(() => {
						

			this.statusBar.styleLightContent();
			this.splashScreen.hide();
		localStorage.setItem("type_player", "live");
		localStorage.setItem("podcast_url", '');
		localStorage.setItem("player", "stop");

			$.getJSON('https://www.mediaone-digital.ch/cache/live/radiolac_live.json', function(data){
				localStorage.setItem("playerDetail",data.start_short+'-'+data.end_short);
				localStorage.setItem("playerTitre",data.title);
				localStorage.setItem("playerSoustitre",data.animators);
				localStorage.setItem("playerCover",data.picture); //data.picture
			});					

			
			// Initialize some options
			this.initializeOptions();
			if (this.platform.is('cordova')) {
				this.handlerNotifications();
			}
		
			
				let ratio = Math.max(window.devicePixelRatio || 1, 1);

				(<any>window).SmartAdServer.setOptions({
					siteId: 241727,
					baseUrl: 'http://mobile.smartadserver.com',
					position: (<any>window).SmartAdServer.AD_POSITION.BOTTOM_CENTER,
						// offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
					bgColor: 'black', // color name, or '#RRGGBB'
					isTesting: false, // set to true, to receiving test ad for testing purpose
					autoShow: true, // auto show interstitial ad when loaded, set to false if prepare/show
				});
				
				
				(<any>window).SmartAdServer.prepareInterstitial( {
					adId: '947330/29216', 
					autoShow: true
				});
			
				console.log('Platform is ready');
			
			
			setInterval(() => {      
						$.ajaxSetup({ cache: false });
						$.getJSON('https://www.mediaone-digital.ch/cache/radiolac.json?hash_id='+Math.random(), function(data){
								localStorage.setItem("songArtist",data.live[0].interpret);
								localStorage.setItem("songTitle",data.live[0].title);
								localStorage.setItem("songCover",data.live[0].imageURL);
						});

						if(localStorage.type_player == 'live'){
							$.getJSON('https://www.mediaone-digital.ch/cache/live/radiolac_live.json?hash_id='+Math.random(), function(data){
								localStorage.setItem("playerDetail",data.start_short+'-'+data.end_short);
								localStorage.setItem("playerTitre",data.title);
								localStorage.setItem("playerSoustitre",data.animators);
								localStorage.setItem("playerCover",data.picture); //data.picture
								$('.songArtist').html(data.start_short+'-'+data.end_short);
								$('.songTitle').html(data.title);
								$('.songCover').attr('src',data.picture);
							});				
						}

			}, 30000);
			
			

		});
		


		// Change the value for the batch every 5 seconds
		setInterval(() => {
			this.unreadCountObservable.next(Math.floor(Math.random() * 10));
		}, 5000);

	}

	private initializeOptions(): void {
		this.options = new Array<MenuOptionModel>();

		// Load simple menu options
		// ------------------------------------------
		this.options.push({
			iconName: 'ios-radio',
			displayName: 'Accueil',
			component: AccueilPage,

			// This option is already selected
			selected: true,
			key: '',
			header: true
		});

/*		
this.options.push({
iconName: 'ios-radio',
displayName: 'Emissions',
//badge: ArrayObservable.of('NEW'),
component: BlogPage,
key: '34',
header: true
});

		this.options.push({
			iconName: 'ios-contacts',
			displayName: 'Politique',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '39',
			header: true
		});
		this.options.push({
			iconName: 'ios-stats',
			displayName: 'Economie',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '40',
			header: true
		});
		this.options.push({
			iconName: 'ios-people',
			displayName: 'Culture',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '23',
			header: true
		});

		this.options.push({
			iconName: 'ios-paper',
			displayName: 'Justice',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '422',
			header: true
		});
		
		this.options.push({
			iconName: 'ios-quote',
			displayName: 'Faits divers',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '420',
			header: true
		});

		this.options.push({
			iconName: 'ios-pulse',
			displayName: 'Santé',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '421',
			header: true
		});
		
		this.options.push({
			iconName: 'ios-bicycle',
			displayName: 'Sport',
			//badge: ArrayObservable.of('NEW'),
			component: BlogPage,
			key: '19',
			header: true
		});
*/	
		// Load options with nested items (with icons)
		// -----------------------------------------------
		
		this.options.push({
			displayName: 'Podcasts',
			iconName: 'ios-musical-notes',
			subItems: [
				{
					iconName: '',
					displayName: 'Radio Lac Matin',
					component: PodcastsPage,
					key: '51',
					header: true
				},
				{
					iconName: '',
					displayName: 'Mieux Vivre',
					component: PodcastsPage,
					key: '388',
					header: true
				},
				{
					iconName: '',
					displayName: 'En toute vérité',
					component: PodcastsPage,
					key: '399',
					header: true
				},
				{
					iconName: '',
					displayName: 'Radio Lac Midi',
					component: PodcastsPage,
					key: '402',
					header: true
				},
				{
					iconName: '',
					displayName: 'Pop Collection',
					component: PodcastsPage,
					key: '411',
					header: true
				},
				{
					iconName: '',
					displayName: "Le Club Radio Lac",
					component: PodcastsPage,
					key: '230',
					header: true
				},
				{
					iconName: '',
					displayName: "La C'lac",
					component: PodcastsPage,
					key: '413',
					header: true
				},
				{
					iconName: '',
					displayName: "L'actu en continu",
					component: PodcastsPage,
					key: '81',
					header: true
				},
				{
					iconName: '',
					displayName: 'Le Sport',
					component: PodcastsPage,
					key: '59',
					header: true
				}
			]
		});
		
		this.options.push({
			iconName: 'ios-time-outline',
			displayName: 'Programme',
			//badge: ArrayObservable.of('NEW'),
			component: ContenupagePage,
			key: 'https://www.radiolac.ch/emissions-et-programme/?clean=true',
			header: true
		});
		this.options.push({
			iconName: 'ios-mail-outline',
			displayName: 'Contact',
			//badge: ArrayObservable.of('NEW'),
			component: ContenupagePage,
			key: 'https://applications.mediaonegroup.ch/contactez-nous-radio-lac/',
			header: true
		});
	}

	public selectOption(option: MenuOptionModel): void {
		this.menuCtrl.close().then(() => {
			if (option.custom && option.custom.isLogin) {
				this.presentAlert('You\'ve clicked the login option!');
			} else if (option.custom && option.custom.isLogout) {
				this.presentAlert('You\'ve clicked the logout option!');
			} else if (option.custom && option.custom.isExternalLink) {
				let url = option.custom.externalUrl;
				window.open(url, '_blank');
			} else {
				/*
				if (option.key) {
					this.navCtrl.setRoot(option.component, { 'title': option.displayName, 'key': option.key, 'header': option.header });
				}
				else {
				*/
					this.navCtrl.setRoot(option.component, { 'title': option.displayName, 'key': option.key, 'header': option.header});
				//}
			}
		});
	}

	public collapseMenuOptions(): void {
		this.sideMenu.collapseAllOptions();
	}

	public presentAlert(message: string): void {
		let alert = this.alertCtrl.create({
			title: 'Information',
			message: message,
			buttons: ['Ok']
		});
		alert.present();
	}
	
	private infos(){
       let alert = this.alertCtrl.create({
			title: 'Informations',
			message: 'Media One Group - Build v'+localStorage.build,
			buttons: ['Ok']
		});
		alert.present();
    }

	
	public whatsapp(){
		
		
		window.open("whatsapp://send?text=Bonjour&phone=+41799183000&abid=+41799183000",'_system', 'location=yes');
	}
	
	private handlerNotifications(){
		
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
