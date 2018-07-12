import { Component, ViewChild, Injectable } from '@angular/core';

import { IonicPage, NavController, NavParams, Platform, Content, PopoverController, LoadingController, ModalController, ViewController} from 'ionic-angular';
import { ScrollHideConfig } from '../../directives/scroll-hide/scroll-hide';
import * as $ from "jquery";
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailsPage } from '../details/details';
import { PlayerPage } from '../player/player';
import { PlayerPlaylistPage } from '../player-playlist/player-playlist'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


//import {Http, Response} from "@angular/http";
//import {Observable} from 'rxjs/Rx';
//import 'rxjs/add/operator/catch';
//import 'rxjs/Rx';
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})

export class AccueilPage {
	private loadingPopup: any;
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
	footerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-bottom', maxValue: undefined };
  	headerScrollConfig: ScrollHideConfig = { cssProperty: 'margin-top', maxValue: 44 };
	link: string;
    title: string;
    image: string;
	postsLoading: any;
	pagination: number = 1;
	maximumPages = 10;
	posts: Array<any> = [];
test:any;
	liveTitre: string;
	liveHeures: string;
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
		private ga: GoogleAnalytics
	){
		this.loadData();	
			this.test = 2;
			this.liveTitre = 'Radio Lac Matin';
			this.liveHeures = '06H-09H';
	
			
	this.ga.startTrackerWithId('UA-104904297-2')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('home');
        this.ga.trackEvent('Navigation', 'Home');

      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
			
  }

	
update(refresher) {
    console.log('Begin async operation', refresher);
		  setTimeout(() => {

	this.loadData(false,refresher);	
			  },200);
  }
	
	  loadData(infiniteScroll?,refresher?) {

			if (refresher) {
				this.pagination = 1;
			}

			this.http.get('https://www.radiolac.ch/wp-json/mog/v1/get_data?type=post&taxonomy=category&per_page=20&page='+this.pagination).map(res => res.json()).subscribe(data => {
			  //  this.posts = data;
				console.log(this.posts);
				if (refresher) {
								  this.posts = [];
									refresher.complete();
								}
								for(let i of data){

									  

									

	this.posts.push(i);


								}
				
												this.postsLoading = '1';

							  
								if (infiniteScroll) {
									infiniteScroll.complete();
								}
			});
		  

			  //Leaderboard
			


	  }	

	
	
 loadMore(infiniteScroll) {
    this.pagination += 1;
    this.loadData(infiniteScroll);
 
    if (this.pagination === this.maximumPages) {
      infiniteScroll.enable(false);
    }
  }	
	

	
	ngAfterViewInit() {
		


}
	
ionViewDidLoad() {

	

	  
	  //			interstitial: '947330/29216'

	

	
	
	  if(localStorage.type_player == 'live'){
        }
        else
        {
			$('.songArtist').html(localStorage.podcast_title);
			$('.songTitle').html(localStorage.podcast_category);
			$('.songCover').attr('src',localStorage.podcast_cover);
        }
	
		if(localStorage.player == 'play'){
			$('.btPlayer').html('<i class="fas fa-pause-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();
        }
        else
        {
			$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
        }
      
		$.ajaxSetup({ cache: false });
		$.getJSON('https://www.mediaone-digital.ch/cache/radiolac.json', function(data){
			
				   	if(localStorage.type_player == 'live'){
						$('.songArtist').html(data.live[0].interpret);
						$('.songTitle').html(data.live[0].title);
						$('.songCover').attr('src',data.live[0].imageURL);
					}
					else
					{
						//
					}

		});
	
/*
		this.platform.ready().then(() => {

			//Leaderboard
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


			(<any>window).SmartAdServer.createBanner( {
				adId: '947330/33546', 
				autoShow: true,
				width: this.platform.width()*ratio,
				height: (this.platform.width()*0.15625)*ratio
			});	
			console.log('Platform is ready');
		});	 
*/		  

}
	
 ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
 
// 	(<any>window).SmartAdServer.hideBanner();
 }
	
	openads(link){
//		const browser = this.iab.create('https://ionicframework.com/');
		            window.open(link, "_system");

	}
	
	
startAudio() {      
  // if (this.plt.is('cordova')) {
     
        if(localStorage.player == 'play'){
                this._player.pauseProvider();
			  //  this.musicControls.listen();
				//this.musicControls.updateIsPlaying(false);
				//this.onplaying = '0';
                
                //$('.btPlayer').html('<i class="fas fa-play-circle fa-3x"></i>');
        }
        else
        {
			
			this._player.playerconfigProvider();
			this._player.playProvider();
		}

}

	private whatsappShare(title, image, link){
    this.socialSharing.shareViaWhatsApp(title, image, link)
      .then(()=>{
//
    },
      ()=>{
         //
      })
  }



private share(message, title, image, link){
    this.socialSharing.share(title, image, image, link)
      .then(()=>{
       //
      },
      ()=>{
         //
      })
  }
	
private showDetails(id,title,link){
        //console.log(this.login);
       
    
    this.navCtrl.push(DetailsPage,{
            title: title,
            key: id,
		link:link
           
        });
}
	

private openPlayer(){
        //console.log(this.login);
       let modal = this.modalCtrl.create(PlayerPage); //PlayerPage
    modal.present();
    
    
    }
	
}
	