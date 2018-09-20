import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { AccueilPage } from '../accueil/accueil';

import { ActualitePage } from '../actualite/actualite';
import { ProgrammePage } from '../programme/programme';
import { PodcastsPage } from '../podcasts/podcasts';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AccueilPage;
  tab2Root = ActualitePage;
  tab3Root = PodcastsPage;

  constructor() {

  }
}
