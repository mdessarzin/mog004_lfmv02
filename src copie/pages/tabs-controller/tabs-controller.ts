import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PlayerPage } from '../player/player';

@Component({
  templateUrl: 'tabs-controller.html'
})

export class TabsControllerPage {

  tab1Root: any = PlayerPage;
  tab2Root: any = PlayerPage;
  tab3Root: any = PlayerPage;
  constructor() {
  }
  
}
