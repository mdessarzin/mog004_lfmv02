import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPlaylistPage } from './player-playlist';

@NgModule({
  declarations: [
    PlayerPlaylistPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerPlaylistPage),
  ],
})
export class PlayerPlaylistPageModule {}
