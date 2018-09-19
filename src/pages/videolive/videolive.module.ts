import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VideolivePage } from './videolive';

@NgModule({
  declarations: [
    VideolivePage,
  ],
  imports: [
    IonicPageModule.forChild(VideolivePage),
  ],
})
export class VideolivePageModule {}
