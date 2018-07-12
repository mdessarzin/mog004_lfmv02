import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-contactez-nous',
  templateUrl: 'contactez-nous.html'
})
export class ContactezNousPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private ga: GoogleAnalytics) {
	  alert(navParams.get('key'));
	  
  }
  
}
