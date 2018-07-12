import { NgModule } from '@angular/core';
import { ScrollHideDirective } from './scroll-hide/scroll-hide';
import { IframeAutoHeightDirective } from './iframeautoheight/iframeautoheight';

@NgModule({
	declarations: [ScrollHideDirective,IframeAutoHeightDirective],
	imports: [],
	exports: [ScrollHideDirective,IframeAutoHeightDirective]
})
export class DirectivesModule {}
