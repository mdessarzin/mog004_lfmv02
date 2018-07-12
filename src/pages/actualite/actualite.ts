import { Component, ViewChild } from '@angular/core';
import { IonicPage, IonicPageModule, NavController, NavParams } from 'ionic-angular';

import { BlogPage } from '../../pages/blog/blog';

@Component({
  selector: 'page-actualite',
  templateUrl: 'actualite.html'
})
export class ActualitePage {
	 
	
	
  constructor(public navCtrl: NavController, private navParams: NavParams) {
 
  }

  ngAfterViewInit() {
    // this.superTabsCtrl.increaseBadge('page1', 10);
    // this.superTabsCtrl.enableTabSwipe('page3', false);
    // this.superTabsCtrl.enableTabsSwipe(false);

    // Test issue #122
    // setTimeout(() => {
    //   this.superTabs.slideTo(4);
    // }, 2000);
  }

 

}
