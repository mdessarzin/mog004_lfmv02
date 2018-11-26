import { Component } from '@angular/core';
import { NavParams} from 'ionic-angular';
import { AccueilPage } from '../accueil/accueil';
import { ActualitePage } from '../actualite/actualite';
import { PlayerPlaylistPage } from '../player-playlist/player-playlist';
import { PodcastsPage } from '../podcasts/podcasts';
import { BlogPage } from '../blog/blog';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	
	concours: {
		title: "lawlesscreation",
		key: "31"
	}
	
	tab1Root = AccueilPage;
	tab2Root = ActualitePage;
	tab3Root = PodcastsPage;
	tab4Root = PlayerPlaylistPage;
	tab5Root = BlogPage;
	
	
	constructor(public navParams: NavParams) {
  }
}