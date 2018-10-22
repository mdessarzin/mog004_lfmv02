import {
    Component,
    ElementRef,
    AfterContentInit,
    OnChanges,
    SimpleChanges,
    Input
} from '@angular/core';
import StackBlur from 'stackblur-canvas';

@Component({
    selector: 'mama-stack-blur',
    template: `
                <img />
                <canvas></canvas>
            `,
    styles: [
        `
        :host {
            display: block;
            overflow: hidden;
        }

        :host > canvas {
            padding: 0;
            margin: 0;
            top: 0;
        }

        :host > img {
            display: none;
        }
        `
    ]
})
export class MamaStackBlur implements AfterContentInit, OnChanges {
    private element: HTMLElement;
    private image: HTMLImageElement;
    private canvas: HTMLCanvasElement;

    @Input() imageUrl: string;
    @Input() blurAlpha: boolean = false;
    @Input() radius: number = 10;
    @Input() width: number = 0;
    @Input() height: number = 0;

    constructor(element: ElementRef) {
        this.element = element.nativeElement;
    }

    ngAfterContentInit() {
        this.image = <HTMLImageElement>this.element.getElementsByTagName('img')[0];
        this.canvas = <HTMLCanvasElement>this.element.getElementsByTagName('canvas')[0];
        this.renderImage();
    }

    ngOnChanges(changes: SimpleChanges) {
        const {
            width,
            height,
            element,
            canvas
            } = this;

        for (let propName in changes) {
            if (propName === 'width' && width) {
                element.style.width = `${width}px`;
                canvas && (canvas.style.width = `${width}px`);
            }

            if (propName === 'height' && height) {
                element.style.height = `${height}px`;
                canvas && (canvas.style.height = `${height}px`);
            }

            if (propName === 'imageUrl' ||
                propName === 'blurAlpha' ||
                propName === 'radius') {
                this.renderImage();
            }
        }
    }

    renderImage() {
        const {
            canvas,
            image
            } = this;

        if (!canvas || !image) {
            return;
        }

        const {
            width,
            height,
            blurAlpha,
            radius,
            element
            } = this;

        image.src = this.imageUrl;
        image.onload = () => {
            StackBlur.image(image, canvas, radius, blurAlpha);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        };

        element.style.width = `${width}px`;
        element.style.height = `${height}px`;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }
}
