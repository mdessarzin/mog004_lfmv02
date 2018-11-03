import { Component, ViewChild, Injectable } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ToastController, Platform, Content, PopoverController, LoadingController, ModalController, Slides } from 'ionic-angular';
import * as $ from "jquery";
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { MusicControls } from '@ionic-native/music-controls';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailsPage } from '../details/details';
import { PlayerPage } from '../player/player';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
import { SwiperModule } from 'angular2-useful-swiper';

@Component({
	selector: 'page-actualite',
	templateUrl: 'actualite.html'
})

//			this.http.get('https://www.lfm.ch/wp-json/mog/v1/get_data?type=post&taxonomy=category&term_id=221&per_page=20&page=1&hash_id=' + Math.random()).map(res => res.json()).subscribe(data => {


export class ActualitePage {
	@ViewChild(Content) content: Content;
	private loadingPopup: any;
	artist: string;
	cover: string;
	track: string;
	date: string;
	cat: number = 10;
	live: string;
	onplaying: string;
	animateClass: any;
	params: any = {};
	data: any = {};
	pushPage: any;
	buttonIcon: string = 'ios-play';
	link: string;
	title: string;
	image: string;
	header: string;
	postsLoading: any = 0;
	pagination: number = 1;
	maximumPages = 10;
	posts: Array<any> = [];
	toast: any;
	color1: string = 'light';
	color2: string = 'light';
	color3: string = 'light';
	color4: string = 'light';
	color5: string = 'light';
	color6: string = 'light';
	placeholder: string;


	@ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides;


	SwipedTabsIndicator: any = null;
	tabs: any = [];

	config: Object = {
		slidesPerView: 'auto',
		centeredSlides: false,
		direction: 'horizontal',
		freeMode: true,
		fade: {
			crossFade: true,
		},
		roundLengths: true,
		effect: 'slide' //use cube,flip,coverflow or fade
	};


	constructor(
		public navCtrl: NavController,
		public _player: AudioStreamProvider,
		public http: Http,
		public loadingCtrl: LoadingController,
		public musicControls: MusicControls,
		private socialSharing: SocialSharing,
		public modalCtrl: ModalController,
		private statusBar: StatusBar,
		//private iab: InAppBrowser,
		public viewCtrl: ViewController,
		public plt: Platform,
		public navParams: NavParams,
		public platform: Platform,
		private iab: InAppBrowser,
		private ga: GoogleAnalytics,
		private toastCtrl: ToastController
	) {
		this.cat = 10;
		this.title = navParams.get('title');
		this.placeholder = 'https://lfm.ch/mobile/placeholder.png'

		this.loadData();

		this.statusBar.styleDefault();


		this.ga.startTrackerWithId('UA-4500692-2')
			.then(() => {
				console.log('Google analytics is ready now');
				this.ga.trackView(this.title);
				this.ga.trackEvent('Navigation', this.title);

			})
			.catch(e => console.log('Error starting GoogleAnalytics', e));

	}



	update(refresher) {
		console.log('Begin async operation', refresher);

		this.loadData(false, refresher);
	}

	loadData(infiniteScroll?, refresher?) {

		const toast = this.toastCtrl.create({
			message: 'Chargement des articles',
			position: 'bottom'
		});
		//$('.loadingaudio').show();
		toast.present();


		if (refresher) {
			this.pagination = 1;
		}

		if (this.pagination == 1) {
			this.posts = [];
		}

		this.http.get('https://www.lfm.ch/wp-json/mog/v1/get_data?type=post&taxonomy=category&term_id=' + this.cat + '&per_page=20&page=' + this.pagination + '&hash_id=' + Math.random()).map(res => res.json()).subscribe(data => {
			//  this.posts = data;
			console.log(this.posts);
			
			if (refresher) {
				this.posts = [];
				refresher.complete();
			}

			for (let i of data) {
				this.posts.push(i);

			}
			toast.dismiss();
			this.postsLoading = '1';
			//$('.loadingaudio').hide();
			if (infiniteScroll) {
				infiniteScroll.complete();
			}
			else {




			}
		});


	}

	loadMore(infiniteScroll) {
		this.pagination += 1;
		this.loadData(infiniteScroll);

		if (this.pagination === this.maximumPages) {
			infiniteScroll.enable(false);
		}
	}


	//Prépation de la fonction de chargement
	ionViewDidLoad() {

		$('.btcat_10').css('background-color', '#833177').css('color', '#fff');


		if (localStorage.player == 'play') {
			// this.buttonIcon = "ios-pause";
			$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();

		}
		else {
			//this.buttonIcon = "ios-play";
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
		}


	}


	private selectioncat(id) {
		$('.t').css('background-color', '#f4f4f4').css('color', '#000');
		$('.btcat_' + id).css('background-color', '#833177').css('color', '#fff');
		this.postsLoading = 0;
		this.cat = id;
		this.pagination = 1;
		this.loadData();
	}

	private whatsappShare(title, image, link) {
		this.socialSharing.shareViaWhatsApp(title, image, link)
			.then(() => {
				//
			},
				() => {
					//
				})
	}



	private share(message, title, image, link) {
		this.socialSharing.share(title, image, image, link)
			.then(() => {
				//
			},
				() => {
					//
				})
	}

	private showDetails(id, title, link) {		
		this.iab.create(link,'_blank',{
			location : 'no',//Or 'no' 
			hidden : 'no', //Or  'yes'
			zoom : 'no',//Android only ,shows browser zoom controls 
			hardwareback : 'yes',
			mediaPlaybackRequiresUserAction : 'no',
			shouldPauseOnSuspend : 'no', //Android only 
			closebuttoncaption : 'Fermer', //iOS only
			disallowoverscroll : 'no', //iOS only 
			toolbar : 'yes', //iOS only 
			enableViewportScale : 'no', //iOS only 
			allowInlineMediaPlayback : 'no',//iOS only 
			presentationstyle : 'fullscreen',//iOS only 
			fullscreen : 'yes',//Windows only
			hidenavigationbuttons: 'no',
			toolbarcolor: '#ffffff',
			closebuttoncolor: '#000000',
			toolbarposition: 'top',
			toolbartranslucent: 'no',
			transitionstyle: 'crossdissolve',
			footer: 'yes',
			footercolor: '#ffffff'
		});
	}



	private openPlayer() {
		//console.log(this.login);
		let modal = this.modalCtrl.create(PlayerPage);
		modal.present();


	}
}