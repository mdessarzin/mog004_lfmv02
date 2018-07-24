import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WebradiosPage } from './webradios';

@NgModule({
  declarations: [
    WebradiosPage,
  ],
  imports: [
    IonicPageModule.forChild(WebradiosPage),
  ],
})
export class WebradiosPageModule {}
