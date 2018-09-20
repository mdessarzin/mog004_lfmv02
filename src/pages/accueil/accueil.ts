import { Component, ViewChild, Injectable } from '@angular/core';

import { IonicPage, NavController, NavParams, Platform, Content, PopoverController, LoadingController, ModalController, ViewController,Slides} from 'ionic-angular';
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
import { SwiperModule } from 'angular2-useful-swiper'; 



//import {Http, Response} from "@angular/http";
//import {Observable} from 'rxjs/Rx';
//import 'rxjs/add/operator/catch';
//import 'rxjs/Rx';
@Component({
  selector: 'page-accueil',
  templateUrl: 'accueil.html'
})

export class AccueilPage {
	 @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;

  SwipedTabsIndicator :any= null;
  tabs:any=[];
	
	config: Object = {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            spaceBetween: 10,
            slidesPerView:2.3, //use any number 1.8 or 4.2 or 7.3 etc..
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
				this.tabs=["page1","page2"];
			
		this.loadData();	
		this.test = 2;
	
		this.ga.startTrackerWithId('UA-104904297-2')
		  .then(() => {
			console.log('Google analytics is ready now');
			this.ga.trackView('home');
			this.ga.trackEvent('Navigation', 'Home');

		  })
		  .catch(e => console.log('Error starting GoogleAnalytics', e));
			
  }

	
	ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");


  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
      // this condition is to avoid passing to incorrect index
  	if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
  	{
  		this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';

  	}
    
    }

  animateIndicator($event) {
  	if(this.SwipedTabsIndicator)
   	    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
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

	this.http.get('https://www.radiolac.ch/wp-json/mog/v1/get_data?type=post&taxonomy=category&per_page=20&page='+this.pagination+'&hash_id=' + Math.random()).map(res => res.json()).subscribe(data => {
	  //  this.posts = data;
		console.log(this.posts);
		if (refresher){
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
	
		if(localStorage.player == 'play'){
			this.buttonIcon = 'ios-stop';
			$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
			$('.fab-md-danger').removeClass("pulseplay");
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();
        }
        else
        {
			this.buttonIcon = 'ios-play';
			$('.btPlayerhome').html('<i class="fas fa-play"></i>');
			$('.fab-md-danger').addClass("pulseplay");
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
        }
      	
}
	
 ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
 
// 	(<any>window).SmartAdServer.hideBanner();
 }
	
openads(link){
	window.open(link, "_system");
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

	
private startAudio() {      
        if(localStorage.player == 'play'){
				this._player.pauseProvider();
				$('.btPlayerhome').html('<i class="fas fa-play"></i>');
			$('.fab-md-danger').addClass("pulseplay");
				$('.playerEtat_2').hide();
				$('.playerEtat_1').hide();
				$('.playerEtat_0').show();
				
		}
        else
        {
			this.buttonIcon = 'ios-stop';
			this._player.playProvider();
			$('.btPlayerhome').html('<i class="fas fa-pause"></i>');
			$('.fab-md-danger').removeClass("pulseplay");
			$('.playerEtat_0').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_2').show();
		}
}

private openPlayer(){
        //console.log(this.login);
       	let modal = this.modalCtrl.create(PlayerPage); //PlayerPage
		modal.present();
    }
}