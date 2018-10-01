import { Component } from '@angular/core';

/**
 * Generated class for the AutoplayContentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'autoplay-content',
  templateUrl: 'autoplay-content.html'
})
export class AutoplayContentComponent {

  text: string;

  constructor() {
    console.log('Hello AutoplayContentComponent Component');
    this.text = 'Hello World';
  }

}
