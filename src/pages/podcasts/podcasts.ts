import { Component, ViewChild, Injectable } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Content, PopoverController, LoadingController, ModalController, AlertController, Slides} from 'ionic-angular';
import * as $ from "jquery";
import { MusicControls } from '@ionic-native/music-controls';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DetailsPage } from '../details/details';
import { PlayerPage } from '../player/player';
import { AudioStreamProvider } from '../../providers/audio-stream/audio-stream';
import { PlayerpopupPage } from '../playerpopup/playerpopup';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ChroniquesPage } from '../chroniques/chroniques';

@Component({
  selector: 'page-podcasts',
  templateUrl: 'podcasts.html'
})
export class PodcastsPage {
	@ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;
	SwipedTabsIndicator :any= null;
	tabs:any=[];

	private loadingPopup: any;
    artist: string;
    cover: string;
    track: string;
    date: string;
    cat: string;
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
	
   posts: Array<any> = [];
postsLoading: any;
pagination: number = 1;
	nbPost: number = 0;
  maximumPages = 10;

  constructor(
		public navCtrl: NavController,
		public http: Http, 
		public loadingCtrl: LoadingController,
		private socialSharing: SocialSharing,
		public navParams: NavParams,
		public plt: Platform,
		public modalCtrl: ModalController,
		public _player: AudioStreamProvider,
		public musicControls: MusicControls,
		private iab: InAppBrowser,
		 private ga: GoogleAnalytics,
		 	public alertCtrl: AlertController,
	){
			
		this.tabs=["Lausanne","Genève"];
		if(navParams.get('header')==true){
			this.header = 'yes';
		}
			
		this.title = navParams.get('title');
			
			
	this.ga.startTrackerWithId('UA-104904297-2')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView(this.title);
        this.ga.trackEvent('Navigation', this.title);
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
			
			
	this.loadData();
			

			
  }
	
	
	
update(refresher) {
    console.log('Begin async operation', refresher);
	
	this.loadData(false,refresher);		
  }
	
  loadData(infiniteScroll?,refresher?) {
	  
	  
			if (refresher) {
				this.pagination = 1;
			}

			this.http.get('https://www.lfm.ch/wp-json/mog/v1/get_data?type=podcasts&taxonomy=chronique&per_page=15&page='+this.pagination+'&hash_id='+Math.random()).map(res => res.json()).subscribe(data => {
			  //  this.posts = data;
				console.log(this.posts);
				if (refresher) {
								  this.posts = [];
									refresher.complete();
								}

								for(let i of data){
									this.posts.push(i);
									this.nbPost = 1;
								}
				
								if(this.nbPost == 0){
									let alert = this.alertCtrl.create({
									  title: 'Aucun podcast',
									  subTitle: "Aucun podcast n'a été trouvé pour cette chronique.",
									  buttons: ['Fermer']
									});
									alert.present();
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
	

  private configPlayer(title,image, text, date, link) {


	  if(localStorage.podcast_url == link){

	  }
	  else {
		    console.log('nouveau son');
			localStorage.setItem("podcast_url", link);
			this._player.pauseProvider();
			this._player.playerconfigProvider(link);
			localStorage.setItem("podcast_title", title);
			localStorage.setItem("podcast_category", text);
			localStorage.setItem("podcast_cover", image);
			localStorage.setItem("podcast_nouveau", 'oui');
			$('.songArtist').html(text);
			$('.songTitle').html(title);
			$('.songCover').attr('src',image);
			localStorage.setItem("player", 'stop');
		  //localStorage.setItem("player", "play");
	  }
		
       let modal = this.modalCtrl.create(PlayerPage);
    	modal.present();   
  }
  


ionViewDidLoad() {

		if(localStorage.player == 'play'){
           // this.buttonIcon = "ios-pause";
			$('.playerEtat_2').hide();
			$('.playerEtat_0').hide();
			$('.playerEtat_1').show();
        }
        else
        {
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
        }
	

	
}
	
	ionViewDidEnter() {
		this.SwipedTabsIndicator = document.getElementById("indicator");
	}
	updateIndicatorPosition() {
	  	// this condition is to avoid passing to incorrect index
		if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
		{
			this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
		}

	}

	selectTab(index) {    
		this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
		this.SwipedTabsSlider.slideTo(index, 500);

		if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
		{
			this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';

		}
	}

	animateIndicator($event) {
		if(this.SwipedTabsIndicator)
			this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
	}

	
	
 ionViewWillLeave() {
    console.log("Looks like I'm about to leave :(");
 
// 	(<any>window).SmartAdServer.removeBanner();
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
	
	
	
	private startAudio(title,image, text, date, link){

		localStorage.setItem("podcast_title", title);
		localStorage.setItem("podcast_category", text);
		localStorage.setItem("podcast_cover", image);
		
		if(localStorage.player == 'play'){
			this._player.pauseProvider();
			localStorage.setItem("player", "stop");
        }
        else
        {
			localStorage.setItem("player", "play");
			console.log('Play Button clicked');
			this._player.playProvider();
		}
}
	
	private openPlayer(){
		
       let modal = this.modalCtrl.create(PlayerPage);
    	modal.present();   
    }
	
	private openPlayerVideo(url,poster){
        //console.log(this.login);
       let modal = this.modalCtrl.create(PlayerpopupPage,{url:url, poster:poster});
    	modal.present();   
    }
	
	private openChroniques(){
       let modal = this.modalCtrl.create(ChroniquesPage);
    	modal.present();   

    }
	
	
}
