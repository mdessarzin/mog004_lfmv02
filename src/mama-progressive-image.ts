import {
    Component,
    ElementRef,
    AfterContentInit,
    OnChanges,
    SimpleChanges,
    Input
} from '@angular/core';

@Component({
    selector: 'mama-progressive-image',
    template: `
                <div [ngStyle]="getOverlayStyle()">
                    <div [ngStyle]="getOverlayStyle()">
                        <ng-content select="[data-overlay]"></ng-content>
                    </div>
                    <mama-stack-blur [imageUrl]="lowUrl"
                                     [width]="width"
                                     [height]="height"
                                     [blurAlpha]="blurAlpha"
                                     [radius]="blurRadius">
                    </mama-stack-blur>
                </div>
                <img [src]="highUrl"
                     [ngStyle]="getImageStyle()"
                     (load)="onLoad()"/>
            `,
    styles: [
        `
        :host {
            display: block;
            overflow: hidden;
        }

        :host > div
        :host > img,
        :host > div > div {
            padding: 0;
            margin: 0;
            top: 0;
        }

        :host > div {
            position: relative;
        }

        :host > img {
            display: none;
        }

        :host > div > div {
            position: absolute;
        }
        `
    ]
})
export class MamaProgressiveImage implements AfterContentInit, OnChanges {
    private element: HTMLElement;
    private progressWrapper: HTMLElement;
    private image: HTMLImageElement;

    @Input() lowUrl: string;
    @Input() highUrl: string;
    @Input() blurAlpha: boolean = false;
    @Input() blurRadius: number = 10;
    @Input() width: number = 0;
    @Input() height: number = 0;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterContentInit() {
        this.progressWrapper = <HTMLElement>this.element.children[0];
        const images = this.element.getElementsByTagName('img');
        this.image = <HTMLImageElement>images[images.length - 1];
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            propName === 'width' && (this.element.style.width = `${this.width}px`);
            propName === 'height' && (this.element.style.height = `${this.height}px`);
        }
    }

    getImageStyle() {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`
        }
    }

    getOverlayStyle() {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`
        }
    }

    onLoad() {
        this.progressWrapper.style.display = 'none';
        this.image.style.display = 'block';
    }
}
