import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides} from 'ionic-angular';

/**
 * Generated class for the PlayerPlaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-player-playlist',
  templateUrl: 'player-playlist.html',
})
export class PlayerPlaylistPage {

  selectedSegment: string;
  slides: any;

  constructor(public navCtrl: NavController) {

}
}