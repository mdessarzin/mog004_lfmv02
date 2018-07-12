import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,LoadingController} from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as $ from "jquery";
import { Http } from '@angular/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
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


  constructor( public navCtrl: NavController, 
			   public navParams: NavParams, 
			 	private sanitizer: DomSanitizer,
				private socialSharing: SocialSharing,
				public loadingCtrl: LoadingController,
				private ga: GoogleAnalytics
) {
	  
	   this.title = navParams.get('title');
/*
	  
	  setTimeout(() => {
			  fetch('https://www.radiolac.ch/wp-json/mog/v1/get_data?clean=true&post_id='+navParams.get('key'))
				.then(response => response.json())
				.then(data => {
				  console.log(data);
				  for(let i of data){
						//this.posts(i);
					  this.title = i.title;
					  this.image = i.card;
					  this.text = sanitizer.bypassSecurityTrustHtml(i.content);
					  
					 
					  
					}


				});
			},20);
	*/  
	this.link = navParams.get('link');
	this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link+'?clean=true');

  }
	
private loadclose(){
			setTimeout( () => {
				this.postsLoading = '1';
			}, 1000 );
}	
	
private resize(){
	var iframe = $('#remotedata');
	$('#remotedata').height(iframe[0].contentWindow.document.body.scrollHeight + 40);
	//alert('ok');
}	

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
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
	
}
