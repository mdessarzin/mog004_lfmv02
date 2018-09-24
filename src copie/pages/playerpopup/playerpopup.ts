import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Generated class for the PlayerpopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-playerpopup',
  templateUrl: 'playerpopup.html',
})
export class PlayerpopupPage {
  url: string;
  poster: string;
	trustedPostUrl: SafeResourceUrl;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private sanitizer: DomSanitizer) {
	  	this.url = navParams.get('url');
	  	this.poster = navParams.get('poster');
		this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.mediaone-digital.ch/apps/player/index.php?url='+this.url);

  }

  ionViewDidLoad() {
	 
    console.log('ionViewDidLoad PlayerpopupPage');
  }

	  private dismiss() {
    this.viewCtrl.dismiss();
  }

	
}
