import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,LoadingController, ModalController} from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as $ from "jquery";
import { Http } from '@angular/http';
import { PlayerPage } from '../player/player';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the ContenupagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contenupage',
  templateUrl: 'contenupage.html',
})
export class ContenupagePage {
link: string;
    title: string;
    text: any;
    date: string;
   image:any;
    cat: string;
	trustedPostUrl: SafeResourceUrl;
	postsLoading: any;
	setHeight: any;
	posts: Array<any> = [];


  constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		private sanitizer: DomSanitizer, 
		private socialSharing: SocialSharing,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		private ga: GoogleAnalytics
		){
	  
	   this.title = navParams.get('title');

	this.link = navParams.get('key');
	this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link+'?clean=true');
	  
	this.ga.startTrackerWithId('UA-104904297-2')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView(this.title);
        this.ga.trackEvent('Navigation', this.title);
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));

	  /*
	  setTimeout(() => {
			  fetch('https://www.radiolac.ch/wp-json/mog/v1/get_data?clean=true&page_id='+navParams.get('key'))
				.then(response => response.json())
				.then(data => {
				  console.log(data);
				  for(let i of data){
						//this.posts(i);
					  this.text = sanitizer.bypassSecurityTrustHtml(i.content);
					  
					}


				});
			},20);
	  */
	  
	  
	  
  }
	
private resize(){
	var iframe = $('#remotedata');
	$('#remotedata').height(iframe[0].contentWindow.document.body.scrollHeight + 40);
	
	setTimeout( () => {
		this.postsLoading = '1';
	}, 1000 );

	
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
            //this.buttonIcon = "ios-play";
			$('.playerEtat_2').hide();
			$('.playerEtat_1').hide();
			$('.playerEtat_0').show();
        }
	//this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link+'?clean=true');

 
 }

	
private share(){
    this.socialSharing.share(this.navParams.get('text'), this.navParams.get('title'), null, this.navParams.get('link'))
      .then(()=>{
       //
      },
      ()=>{
         //
      })
  }
	
	private openPlayer(){
        //console.log(this.login);
       let modal = this.modalCtrl.create(PlayerPage);
    modal.present();
    
    
    }
	
}