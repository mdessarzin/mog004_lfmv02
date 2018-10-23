import { Component, ViewChild, Injectable } from '@angular/core';
import { NavController, Platform, LoadingController, ModalController, ViewController } from 'ionic-angular';
import * as $ from "jquery";
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { Http } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailsPage } from '../details/details';
import { PlayerPage } from '../player/player';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { SwiperModule } from 'angular2-useful-swiper';
	
@Component({
	selector: 'page-accueil',
	templateUrl: 'accueil.html'
})


export class AccueilPage {
		config: Object = {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		spaceBetween: 10,
		slidesPerView: 2.3, //use any number 1.8 or 4.2 or 7.3 etc..
		direction: 'horizontal',
		parallax: true,
		freeMode: true,
		fade: {
			crossFade: true,
		},
		allowSwipeToPrev: true,
		roundLengths: false,
		effect: 'slide' //use cube,flip,coverflow or fade
	};
	artist: string;
	cover: string;
	track: string;
	date: string;
	cat: string;
	onplaying: string;
	animateClass: any;
	params: any = {};
	data: any = {};
	pushPage: any;
	buttonIcon: string = 'ios-play';
	fakeUsers: Array<any> = new Array(3);
	link: string;
	title: string;
	image: string;
	postsLoading: any;
	pagination: number = 1;
	maximumPages = 10;
	posts: Array<any> = [];
	test: any;
	liveTitre: string;
	liveHeures: string;
	placeholder: any = 'https://lfm.ch/mobile/placeholder.png';
	constructor(
		public navCtrl: NavController,
		public _player: AudioStreamProvider,
		public http: Http,
		public loadingCtrl: LoadingController,
		private socialSharing: SocialSharing,
		public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		public plt: Platform,
		public platform: Platform,
		private iab: InAppBrowser,
		private ga: GoogleAnalytics,
		private streamingMedia: StreamingMedia
	) {
		this.loadData();
		this.test = 2;
		this.ga.startTrackerWithId('UA-104904297-2').then(() => {
				console.log('Google analytics is ready now');
				this.ga.trackView('home');
				this.ga.trackEvent('Navigation', 'Home');
		}).catch(e => console.log('Error starting GoogleAnalytics', e));
	}

	ionViewDidEnter(){
	}

	update(refresher){
		console.log('Begin async operation', refresher);
		setTimeout(() => {
			this.loadData(false, refresher);
		}, 200);
	}

	loadData(infiniteScroll?, refresher?) {
		this.placeholder = 'https://lfm.ch/mobile/placeholder.png';
		if (refresher) {
			this.pagination = 1;
		}

		this.http.get('https://www.lfm.ch/wp-json/mog/v1/get_data?type=post&taxonomy=category&term_id=163&per_page=10&page=' + this.pagination + '&hash_id=' + Math.random()).map(res => res.json()).subscribe(data => {
			//  this.posts = data;
			console.log(this.posts);
			if (refresher) {
				this.posts = [];
				refresher.complete();
			}
			for (let i of data) {
				this.posts.push(i);
			}
			this.postsLoading = '1';
			if (infiniteScroll) {
				infiniteScroll.complete();
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

	ngAfterViewInit() {
		setTimeout(() => {
			$('.fab-md-danger').removeClass("pulseplay");
		}, 6000);
	}

	ionViewDidLoad() {
		$('#coverPlayerHome').attr('src', localStorage.playerCover);
		if (localStorage.player == 'play') {
			this.buttonIcon = 'ios-stop';
			$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
			$('.fab-md-danger').removeClass("pulseplay");
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();
		}
		else {
			this.buttonIcon = 'ios-play';
			$('.btPlayerhome').html('<i class="fas fa-play"></i>');
			$('.fab-md-danger').addClass("pulseplay");
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
		}

	}

	ionViewWillLeave(){
		// 	(<any>window).SmartAdServer.hideBanner();
	}

	openads(link) {
		window.open(link, "_system");
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
		//console.log(this.login);


		this.navCtrl.push(DetailsPage, {
			title: title,
			key: id,
			link: link
		});
	}


	private startAudio() {
		$('.webradio .pause').hide();
		if (localStorage.player == 'play' && localStorage.player_id == '0') {
			this._player.pauseProvider();
			$('.loadingaudio').hide();
			$('.btPlayerhome').html('<i class="fas fa-play"></i>');
			$('.fab-md-danger').addClass("pulseplay");
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();

		}
		else
		{
			this._player.playerconfigProvider('live', '0');4
			this.buttonIcon = 'ios-stop';
			$('.loadingaudio').show();
			this._player.playProvider();
			$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
			$('.fab-md-danger').removeClass("pulseplay");
			$('.playerEtat_0').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_2').show();
		}
	}

	private startWebradios(idwebradio) {


		$('.webradio .pause').hide();
		$('.btPlayerhome').html('<i class="fas fa-play"></i>');
		if(localStorage.player_id == idwebradio && localStorage.player=='play'){
			this._player.pauseProvider();
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
			$('.loadingaudio').hide();
		}
		else {
			this.buttonIcon = 'ios-stop';
			$('.loadingaudio').show();
			this._player.playerconfigProvider('live', idwebradio);
			this._player.playProvider();
			$('.webradio .pause').hide();
			$('.webradio.id_'+idwebradio+' .pause').show();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_2').show();
		}
	}

	public whatsapp() {
		window.open("whatsapp://send?text=Bonjour&phone=+41798421033&abid=+41798421033", '_system', 'location=yes');
	}

	private startVideo() {

			let options: StreamingVideoOptions = {
				successCallback: () => { console.log('Video played') },
				errorCallback: (e) => { console.log('Error streaming') },
				shouldAutoClose: true,
				controls: true
			};

			this.streamingMedia.playVideo('https://livevideo.infomaniak.com/streaming/livecast/lfmmd/playlist.m3u8', options);

			$('.webradio .pause').hide();
			this._player.pauseProvider();
			this.onplaying = '0';
			localStorage.setItem("player", "stop");
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
	}

	private openPlayer() {
		//console.log(this.login);
		let modal = this.modalCtrl.create(PlayerPage); //PlayerPage
		modal.present();
	}
}