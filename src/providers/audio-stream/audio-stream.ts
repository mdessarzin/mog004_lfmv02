import { Injectable, ElementRef } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import * as $ from "jquery";
import { Media, MediaObject } from '@ionic-native/media';
import { MusicControls } from '@ionic-native/music-controls';
import { Subscription } from "rxjs/Subscription";
@Injectable()

export class AudioStreamProvider {

	loadingPopup: any;
	url: string;
	urlJson: string;
	stream: MediaObject = null; //consider changing this to musicfile and all further instances to avoid conflict in the future
	promise: any;
	onloading: string;
	mediaTimer: any;
	live: string;
	artist: string;
	cover: string;
	title: string;
	timingloading: any;

	constructor(private _loadingCtrl: LoadingController, public musicControls: MusicControls, public media: Media) {
	}

	ngOnInit() {

	}
	public settingMusicControl(title, artist, cover) {
		this.musicControls.destroy(); // it's the same with or without the destroy 
		this.musicControls.create({
			track: title,        // optional, default : ''
			artist: artist,                       // optional, default : ''
			cover: cover,      // optional, default : nothing
			isPlaying: true,                         // optional, default : true
			dismissable: true,                         // optional, default : false
			hasPrev: false,      // show previous button, optional, default: true
			hasNext: false,      // show next button, optional, default: true
			hasClose: true,       // show close button, optional, default: false
			hasSkipForward: false,  // show skip forward button, optional, default: false
			hasSkipBackward: false, // show skip backward button, optional, default: false
			skipForwardInterval: 15, // display number for skip forward, optional, default: 0
			skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
			// iOS only, optional
			album: '',     // optional, default: ''
			duration: 0, // optional, default: 0
			elapsed: 0, // optional, default: 0
			//Android
			ticker: ''
		});
		this.musicControls.listen(); // activates the observable above

		this.musicControls.subscribe().subscribe((action) => {
			console.log('action', action);
			const message = JSON.parse(action).message;
			console.log('message', message);
			switch (message) {
				case 'music-controls-next':
					// Do something
					break;
				case 'music-controls-previous':
					// Do something
					break;
				case 'music-controls-pause':
					// Do something
					console.log('music pause');
					localStorage.setItem("player", "stop");
					this.stream.pause();
					this.musicControls.listen();
					this.musicControls.updateIsPlaying(false);
					$('.playerEtat_2').hide();
					$('.playerEtat_1').hide();
					$('.playerEtat_0').show();
					$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
					$('.btPlayerhome').html('<i class="fas fa-play"></i>');
					$('.fab-md-danger').addClass("pulseplay");

					break;
				case 'music-controls-play':
					// Do something
					console.log('music play');
					localStorage.setItem("player", "play");
					this.stream.play();
					this.musicControls.listen();
					this.musicControls.updateIsPlaying(true);
					$('.loadingPlayer').hide();
					$('.btPlayer').show();
					$('.playerEtat_2').hide();
					$('.playerEtat_0').hide();
					$('.playerEtat_1').show();
					$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
					$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
					$('.fab-md-danger').removeClass("pulseplay");

					break;
				case 'music-controls-destroy':
					// Do something
					break;
				// External controls (iOS only)
				case 'music-controls-toggle-play-pause':
					// Do something
					break;
				case 'music-controls-seek-to':
					// Do something
					break;
				case 'music-controls-skip-forward':
					// Do something
					break;
				case 'music-controls-skip-backward':
					// Do something
					break;

				// Headset events (Android only)
				// All media button events are listed below
				case 'music-controls-media-button':
					// Do something
					break;
				case 'music-controls-headset-unplugged':
					// Do something
					break;
				case 'music-controls-headset-plugged':
					// Do something
					break;
				default:
					break;
			}
		});
		this.musicControls.updateIsPlaying(true);
	}



	public playerconfigProvider(typeStream,media?): Observable<boolean> {

		if(typeStream=='replay'){
			this.url = media;
			localStorage.setItem("type_player", "replay");
			$('.webradio .pause').hide();
		}
		else {
			
			if(media=='0'){
				this.url = "https://lausannefm.ice.infomaniak.ch/lausannefm-high.mp3";
				this.urlJson = 'https://www.mediaone-digital.ch/cache/lfm.json';
				localStorage.setItem("player_title", 'LFM');
			}
			else if(media=='4'){
				this.url = "https://webradio0004.ice.infomaniak.ch/webradio0004-128.mp3";
				this.urlJson = 'https://www.mediaone-digital.ch/cache/4.json';
				localStorage.setItem("player_title", 'LFM 80s');
			}
			else if(media=='6'){
				this.url = "https://webradio0006.ice.infomaniak.ch/webradio0006-128.mp3";
				this.urlJson = 'https://www.mediaone-digital.ch/cache/6.json';
				localStorage.setItem("player_title", 'LFM 90s');
			}
			else if(media=='10'){
				this.url = "https://webradio0010.ice.infomaniak.ch/webradio0010-128.mp3";
				this.urlJson = 'https://www.mediaone-digital.ch/cache/10.json';
				localStorage.setItem("player_title", 'LFM Love');
			}
			localStorage.setItem("player_url", this.url);
			localStorage.setItem("player_json", this.urlJson);
			localStorage.setItem("type_player", "live");
			localStorage.setItem("player_id", media);
		}

		
		this.stream = this.media.create(this.url);

		return Observable.of(false);

	}


	public playProvider(): Observable<boolean> {
		localStorage.setItem("player", "play");



		setInterval(() => {

			setTimeout(() => {
				fetch(this.urlJson+'?hash_id=' + Math.random())
					.then(response => response.json())
					.then(data => {
						console.log('playlist:' + data);
						if (this.live == data.live[0].interpret) {
							//
						}
						else {
							this.live = data.live[0].interpret;
							if (localStorage.type_player == 'live') {
								$('.songArtist_').html(data.live[0].interpret);
								$('.songTitle_').html(data.live[0].title);
								$('.songCover_').attr('src', data.live[0].imageURL);
								//this.settingMusicControl($('.songTitle').html(), $('.songArtist').html(), $('.songCover').attr('src'));

							}
							else {
								//
							}
						}

					});
			}, 0);

		}, 15000);

		$.getJSON(this.urlJson+'?hash_id=' + Math.random(), function (data) {
			$('.songArtist_').html(data.live[0].interpret);
			$('.songTitle_').html(data.live[0].title);
			$('.songCover_').attr('src', data.live[0].imageURL);
		});


		$('.loadingaudio').show();
		$('.btPlayer').hide();
		$('.loadingPlayer').show();
		$('.playerEtat_0').hide();
		$('.playerEtat_1').hide();
		$('.playerEtat_2').show();

		this.stream.play();
		//this.settingMusicControl($('.songTitle_').html(), $('.songArtist_').html(), $('.songCover_').attr('src'));
		console.log('play');
		


		this.timingloading = setInterval(() => {
			this.stream.getCurrentPosition().then((curpos) => {
				console.log('chargement');
				if (curpos > 0) {
					$('.loadingaudio').hide();
					$('.loadingPlayer').hide();
					$('.btPlayer').show();
					$('.playerEtat_2').hide();
					$('.playerEtat_0').hide();
					$('.playerEtat_1').show();
					if(localStorage.player_id=='0'){
						$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
						$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
						$('.fab-md-danger').removeClass("pulseplay");
					}
					clearInterval(this.timingloading);
				}
			});
		}, 100);


		this.stream.onStatusUpdate.subscribe(status => {

			console.log(JSON.stringify(status));


			if (status.toString() == "2") { //player start


			}

			if (status.toString() == "4") { // player end running
				$('.playerEtat_2').hide();
				$('.playerEtat_1').hide();
				$('.playerEtat_0').show();
				if(localStorage.player_id=='0'){
					$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
					$('.btPlayerhome').html('<i class="fas fa-play"></i>');
					$('.fab-md-danger').addClass("pulseplay");
					$('.loadingaudio').hide();
				}
				if (this.mediaTimer != null) {
					//clearInterval(this.mediaTimer);    // (*) don t do clearInterval here, or your ionic will not work, see below
					//TODO here : handle html, remove "playing" message
				}
			}

		});

		this.stream.onSuccess.subscribe(() => {
			console.log(" > onSuccess complete");
		});

		this.stream.onError.subscribe(error => {
			console.log(" > onError=" + error);
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
			if(localStorage.player_id=='0'){
				$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
				$('.btPlayerhome').html('<i class="fas fa-play"></i>');
				$('.fab-md-danger').addClass("pulseplay");			
			}
			//clearInterval(this.mediaTimer);  (*) don t do clearInterval here, or your ionic will not work, see below
		});

		//return this.promise;

		//});  
		return Observable.of(false);

	}
	ngOnDestroy() {

	}
	public pauseProvider(): Observable<boolean> {
		//clearInterval(progressbar);
		if (this.timingloading) {
			clearInterval(this.timingloading);
		}

		this.stream.pause();
		this.musicControls.listen();
		this.musicControls.updateIsPlaying(false);
		//this.stream.pause();
		//return false;
		localStorage.setItem("player", "stop");
		$('.playerEtat_2').hide();
		$('.playerEtat_1').hide();
		$('.playerEtat_0').show();
		$('.loadingaudio').hide();
		if(localStorage.player_id=='0'){
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
			$('.btPlayerhome').html('<i class="fas fa-play"></i>');
			$('.fab-md-danger').addClass("pulseplay");
		}
		return Observable.of(false);
	}


	public loadtitlelive() {
		setTimeout(() => {
			fetch(this.urlJson+'?hash_id=' + Math.random())
				.then(response => response.json())
				.then(data => {
					console.log('playlist:' + data);
					if (this.live == data.live[0].interpret) {
						//
					}
					else {
						//this.settingMusicControl($('.songTitle').html(), $('.songArtist').html(), $('.songCover').attr('src'));
						this.live = data.live[0].interpret;
						if (localStorage.type_player == 'live') {
							$('.songArtist_').html(data.live[0].interpret);
							$('.songTitle_').html(data.live[0].title);
							$('.songCover_').attr('src', data.live[0].imageURL);
							localStorage.setItem("songArtist", data.live[0].interpret);
							localStorage.setItem("songTitle", data.live[0].title);
							localStorage.setItem("songCover", data.live[0].imageURL);
						}
						else {
							//
						}
					}

				});
		}, 0);

		setTimeout(() => {
			fetch('https://www.mediaone-digital.ch/cache/live/lfm_live.json?hash_id=' + Math.random())
				.then(response => response.json())
				.then(data => {
					localStorage.setItem("playerDetail", data.start_short + '-' + data.end_short);
					localStorage.setItem("playerTitre", data.title);
					localStorage.setItem("playerSoustitre", data.animators);
					localStorage.setItem("playerCover", data.picture); //data.picture				  
					$('.detail').html(data.start_short + '-' + data.end_short);
					$('.titre').html(data.title);
					$('.soustitre').html(data.animators);
					$('#coverPlayer').attr('src', data.picture);
					$('.playerinfos').fadeIn();
				});
		}, 0);



	}

}