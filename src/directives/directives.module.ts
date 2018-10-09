import { NgModule } from '@angular/core';
import { AutoplayVideoDirective } from './autoplay-video/autoplay-video';
import { ScrollHideDirective } from './scroll-hide/scroll-hide';

@NgModule({
	declarations: [AutoplayVideoDirective,
    ScrollHideDirective],
	imports: [],
	exports: [AutoplayVideoDirective,
    ScrollHideDirective]
})
export class DirectivesModule {}
