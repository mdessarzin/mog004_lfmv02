import { Directive, ElementRef, Renderer, Input } from '@angular/core';
import { Content, Platform } from 'ionic-angular';

@Directive({
  selector: '[ion-shrinking-header]',
})
export class IonShrinkingHeader {

  // content is required to get scroll information
  @Input('ion-shrinking-header') content: Content;

  // internals
  private ionHeaderElement: HTMLElement;
  private toolbarElement: HTMLElement;
  private ionContentElement: HTMLElement;
  private onContentScrollUnbind: Function;
  private headerHeight: number;
  private lastScrollTop: number = 0;
  private shrinkAmount: number = 0;
  private ticking: boolean = false;
  private iOSStatusBarHeight: number = 20;

  constructor(private el: ElementRef, private renderer: Renderer, private platform: Platform) {
    this.ionHeaderElement = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.content === undefined || this.content === null) {
      console.error('IonShrinkingHeader - content is not defined.');
      return;
    }
    this.headerHeight = this.ionHeaderElement.offsetHeight;
    // retrieves the different elements
    this.toolbarElement = this.queryElement(this.ionHeaderElement, '.toolbar');
    if (!this.toolbarElement) {
      console.error('IonShrinkingHeader - no ion-navbar element found.');
      return;
    }
    // retrieves the different elements
    this.ionContentElement = this.queryElement(this.ionHeaderElement.parentElement, '.scroll-content');
    if (!this.ionContentElement) {
      console.error('IonShrinkingHeader - no .scroll-content element found. Scroll must be enabled on your ion-content.');
      return;
    }

    // bind the scroll event to the content
    let cb = this.onContentScroll.bind(this);
    this.onContentScrollUnbind = this.renderer.listen(this.ionContentElement, 'scroll', cb);
  }

  onContentScroll(e: any): void {
    let scrollTop = e.detail ? e.detail.scrollTop : (e.target ? e.target.scrollTop : 0);

    // add boundaries to scrollTop to support iOS bouncing scroll
    if (scrollTop < 0) {
      scrollTop = 0;
    }
    if (scrollTop > this.content.scrollHeight + this.content.contentHeight + this.headerHeight + this.iOSStatusBarHeight) {
      scrollTop = this.content.scrollHeight + this.content.contentHeight + this.headerHeight + this.iOSStatusBarHeight;
    }

    if (scrollTop > this.lastScrollTop) { //scrolling down
      this.shrinkAmount = 
        this.headerHeight 
        - Math.max(0, 
          this.headerHeight 
          - this.shrinkAmount 
          - (scrollTop - this.lastScrollTop)
        );
    } else { //scrolling up
      this.shrinkAmount = 
        Math.max(0, 
          this.headerHeight 
          - (this.headerHeight - this.shrinkAmount) 
          - (this.lastScrollTop - scrollTop)
        );
    }

    if(!this.ticking){
      window.requestAnimationFrame(() => {
        let amount = Math.min(this.headerHeight, this.shrinkAmount);
        // update the margin top of the content element
        this.ionContentElement.style.marginTop = (this.headerHeight - amount + (this.isIos() ? this.iOSStatusBarHeight : 0)) + 'px';
        // move the header bar
        this.ionHeaderElement.style.webkitTransform = 'translate3d(0, -' + amount + 'px, 0)';
        // update header elements opacity
        for(var i = 0; i < this.toolbarElement.children.length; i++) {
          let elem : HTMLElement = <HTMLElement> this.toolbarElement.children[i];
          if (!elem.classList.contains('toolbar-background')) {
            elem.style.opacity = (1 - this.shrinkAmount / this.headerHeight).toString();
          }
        }
        this.ticking = false;
      });
    }
    this.ticking = true;
    this.lastScrollTop = scrollTop;
  }

  isIos() {
    return (this.platform.is('ios'));
  }

  ngOnDestroy() {
    this.onContentScrollUnbind();
  }

  queryElement(elem: HTMLElement, q: string): HTMLElement {
    return <HTMLElement>elem.querySelector(q);
  }
}