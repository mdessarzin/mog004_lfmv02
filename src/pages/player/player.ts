import { Component, ViewChild, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content, PopoverController, LoadingController, ViewController, ModalController, AlertController } from 'ionic-angular';
import * as $ from "jquery";
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { MusicControls } from '@ionic-native/music-controls';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import { map } from 'rxjs/operators';
import { PlayerpopupPage } from '../playerpopup/playerpopup';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the PlayerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-player',
	templateUrl: 'player.html',
})
export class PlayerPage {
	typeplayer: any;

	private loadingPopup: any;
	artist: string;
	cover: string;
	track: string;
	date: string;
	titreplayer: string;
	live: string;
	onplaying: string;
	titre: string;
	soustitre: string;
	detail: string;
	duration_string: string;
	public positions: any = 0;
	durations: any = -1;
	public timingseek: any;
	checklive: any;
	checklivestate: any;

	constructor(
		public navCtrl: NavController,
		private navParams: NavParams,
		public viewCtrl: ViewController,
		public _player: AudioStreamProvider,
		public http: Http,
		public loadingCtrl: LoadingController,
		public plt: Platform,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		private ga: GoogleAnalytics,
	) {


		this.typeplayer = 'audio';
		this.ga.startTrackerWithId('UA-4500692-2')
			.then(() => {
				console.log('Google analytics is ready now');
				this.ga.trackView('Player');
				this.ga.trackEvent('Navigation', 'Player');
			})
			.catch(e => console.log('Error starting GoogleAnalytics', e));


	}


	ngAfterViewInit() {

		if (localStorage.type_player == 'live') {
			$('.songArtist_').html(localStorage.songArtist);
			$('.songTitle_').html(localStorage.songTitle);
			$('.songCover_').attr('src', localStorage.songCover);
			
			if(localStorage.player_id=='0'){
				this.titreplayer = 'Direct';
				$('.detail').html(localStorage.playerDetail);
				$('.titre').html(localStorage.playerTitre);
				$('.soustitre').html(localStorage.playerSoustitre);
				$('#coverPlayer').attr('src', localStorage.playerCover);
			}
			else {
				this.titreplayer = 'Web Radio '+localStorage.player_title;
				$('.detail').hide();
				$('.titre').hide();
				$('.soustitre').hide();
				$('#coverPlayerWebRadio').attr('src', localStorage.player_cover).show();
			}
			

		}
		else {
			this.titreplayer = 'Podcast';

			setTimeout(() => {

				if (localStorage.type_player == 'live') {
					//this._player.loadtitlelive();
					//this._player.playProvider();
				}
				else {


					//this._player.pauseProvider();
					//	this._player.playProvider();
					this._player.stream.getCurrentPosition().then((curpos) => {
						console.log('Player A ' + curpos);
						this.positions = curpos;

					});

					this.timingseek = setInterval(() => {
						this._player.stream.getCurrentPosition().then((curpos) => {
							console.log('Player ' + curpos);
							this.positions = curpos;
						});
					}, 1000);

					this.titreplayer = 'Podcast';
					this.soustitre = localStorage.podcast_title;
					this.titre = '';
					this.detail = localStorage.podcast_category;

					//$('.songArtist').html(localStorage.podcast_title);
					//$('.songTitle').html(localStorage.podcast_category);
					$('.songCover_').attr('src', localStorage.podcast_cover);
					$('#coverPlayer').attr('src', localStorage.podcast_cover);
					console.log('Nouveau son? ' + localStorage.podcast_nouveau);
					if (localStorage.podcast_nouveau == 'oui') {
						//	this.startAudio();
						localStorage.setItem("podcast_nouveau", 'non');
						this._player.playProvider();

					}


					if (localStorage.player == 'play') {
						console.log('Etat PLAY');
						$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');

					}
					else {
						console.log('Etat STOP');
						this._player.playProvider();
						$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
					}


				}
				let self = this;
				this.durations = this._player.stream.getDuration();

			}, 600);

		}
	}

	private dismiss() {
		if (this.checklive) {
			clearInterval(this.checklive);
			
		}
		if (this.timingseek) {
			clearInterval(this.timingseek);
		}
		this.viewCtrl.dismiss();
	}

	slideStart() {
		if (this.timingseek) {
			clearInterval(this.timingseek);
		}
		this._player.pauseProvider();
		console.log('pause');
	}

	slideEnd() {
		var number = Number.parseInt(this.positions) * 1000;
		this._player.stream.seekTo(number);
		this._player.playProvider();
		console.log("End: value: " + this.positions);
		this.timingseek = setInterval(() => {
			this._player.stream.getCurrentPosition().then((curpos) => {
				console.log(curpos);
				this.positions = curpos;
			});
		}, 1000);
	}

	seekTo(type) {

		this._player.stream.getCurrentPosition().then((position) => {
			var number = Number.parseInt(position) * 1000;
			switch (type) {
				case 'back':
					this._player.stream.seekTo(number - 15000);
					break;
				case 'forward':
					this._player.stream.seekTo(number + 15000);
					break;
			}
		});
		this._player.stream.getCurrentPosition().then((curpos) => {
			console.log(curpos);
			this.positions = curpos;
		});
	}

	startAudio() {
		if (localStorage.player == 'play') {
			this._player.pauseProvider();
			if (this.timingseek) {
				clearInterval(this.timingseek);
			}
			this.onplaying = '0';
			localStorage.setItem("player", "stop");
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');

		}
		else {

			if (localStorage.type_player == 'replay') {

				this.timingseek = setInterval(() => {
					this._player.stream.getCurrentPosition().then((curpos) => {
						console.log('lecture' + curpos);
						this.positions = curpos;
					});
				}, 1000);
				this.durations = this._player.stream.getDuration();
				this._player.settingMusicControl(localStorage.podcast_title, localStorage.podcast_category, localStorage.podcast_cover);

			}
			else {
				this._player.settingMusicControl(localStorage.playerTitre, localStorage.playerSoustitre, localStorage.playerCover);

			}


			this.onplaying = '1';
			console.log('Play Button clicked');
			if (localStorage.type_player == 'live') {
				this._player.playerconfigProvider('live', '0');
			}
			else {
				//this.durations = this._player.stream.getDuration();  
			}
			this._player.playProvider();

		}
	}


	ionViewDidLoad() {


		//	  setTimeout(() => {

		/* Démarrage automatique du flux à l'ouverture du player */
		if (localStorage.type_player == 'live') {

			if (localStorage.player == 'stop') {//
				this._player.playerconfigProvider('live', '0');
				this._player.settingMusicControl(localStorage.playerTitre, localStorage.playerSoustitre, localStorage.playerCover);
				this._player.playProvider();
			}


		}
		else {
			this._player.settingMusicControl(localStorage.podcast_title, localStorage.podcast_category, localStorage.podcast_cover);
		}

		if (localStorage.player == 'stop') {
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
			this.onplaying = '0';
		}
		else {
			this._player.stream.getCurrentPosition().then((curpos) => {
				console.log('chargement');
				if (curpos > 0) {
					$('.loadingPlayer').hide();
					$('.btPlayer').show();
					$('.playerEtat_2').hide();
					$('.playerEtat_0').hide();
					$('.playerEtat_1').show();
					$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
				}
				else {
					$('.btPlayer').hide();
					$('.loadingPlayer').show();
					$('.playerEtat_0').hide();
					$('.playerEtat_1').hide();
					$('.playerEtat_2').show();
				}
			});

			$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
			this.onplaying = '1';


		}
		console.log('ionViewDidLoad PlayerPage');
		//	  }, 10);
	}

	goLive() {
		localStorage.setItem("type_player", "live");
		this.titreplayer = 'Direct';

		$('.songArtist_').html(localStorage.songArtist);
		$('.songTitle_').html(localStorage.songTitle);
		$('.songCover_').attr('src', localStorage.songCover);
		$('.detail').html(localStorage.playerDetail);
		$('.titre').html(localStorage.playerTitre);
		$('.soustitre').html(localStorage.playerSoustitre);
		$('#coverPlayer').attr('src', localStorage.playerCover);

		$('.webradio .pause').hide();
		$('.player .scroll-content').css('margin-bottom', '80px');
		$('.btPlayer').hide();
		$('.loadingPlayer').show();
		this._player.pauseProvider();
		this._player.playerconfigProvider('live', '0');
		this._player.playProvider();
		this._player.settingMusicControl(localStorage.playerTitre, localStorage.playerSoustitre, localStorage.playerCover);
	}

}
