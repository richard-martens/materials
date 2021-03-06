import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
    selector: 'rm-materials-img-viewer',
    templateUrl: './img-viewer.component.html',
    styleUrls: ['./img-viewer.component.css']
})
export class ImgViewerComponent implements OnInit {

    @Input() images;

    // max scroll position to the right
    maxScrollHorizontal = 0;

    // min scroll position to the left
    minScrollHorizontal = 0;

    // calculated next scroll position
    scrollPos = 0;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.initScrollRanges();
        // nav to next will disabled only after an interrrupt
        setTimeout(function () {
            this.initScrollRanges();
            // 100ms is enough for refresh, but not for first buiild + start
            // 325ms is enough for first build + start
        }.bind(this), 325);

        this.scrollPos = 0;
    }

    public next() {
        const oScrollContainer = this.elementRef.nativeElement.getElementsByClassName('scroll-container')[0];
        let oCoord,
            oImage;

        if (!oScrollContainer.children.length) {
            throw new Error('Navigation works only with given images');
        }

        if (oScrollContainer.scrollLeft + oScrollContainer.clientWidth > this.maxScrollHorizontal) {
            // end of scrolling area reached
            oScrollContainer.scrollLeft = this.maxScrollHorizontal;

        } else {
            // middle of scrolling area
            oScrollContainer.scrollLeft = oScrollContainer.scrollLeft + oScrollContainer.clientWidth;

            oCoord = oScrollContainer.getClientRects()[0];

            // try to get the image truncated on right side
            oImage = this.getimageAt(Math.round(oCoord.x),
                Math.round(oCoord.y + oScrollContainer.children[0].offsetTop));
            if (oImage) {
                // scroll truncated image into view
                oScrollContainer.scrollLeft = oImage.offsetLeft - this.minScrollHorizontal;
            }

        }

        this.scrollPos = Math.round(oScrollContainer.scrollLeft);

    }

    public prev() {
        const oScrollContainer = this.elementRef.nativeElement.getElementsByClassName('scroll-container')[0];
        let oCoord,
            oImage;

        if (!oScrollContainer.children.length) {
            throw new Error('Navigation works only with given images');
        }

        if (oScrollContainer.scrollLeft - oScrollContainer.clientWidth < this.minScrollHorizontal) {
            oScrollContainer.scrollLeft = 0;

        } else {
            oScrollContainer.scrollLeft = oScrollContainer.scrollLeft - oScrollContainer.clientWidth;

            oCoord = oScrollContainer.getClientRects()[0];

            // try to get the image truncated on left side
            oImage = this.getimageAt(Math.round(oCoord.x + oCoord.width - 1),
                Math.round(oCoord.y + oScrollContainer.children[0].offsetTop));
            // calculate the right frame of viewport
            if (oImage) {
                oScrollContainer.scrollLeft = oImage.offsetLeft + oImage.clientWidth
                    + this.minScrollHorizontal - oScrollContainer.clientWidth;
            }
        }

        this.scrollPos = Math.round(oScrollContainer.scrollLeft);
    }

    private getimageAt(x: number, y: number): Element {
        const oElements = document.elementsFromPoint(x, y);

        // if an array contains only one image, then the result ist the image
        return oElements.find(function (oCurrent) {
            if (oCurrent instanceof HTMLImageElement) {
                return true;
            }
        });
    }

    private initScrollRanges() {
        const oScrollContainer = this.elementRef.nativeElement.getElementsByClassName('scroll-container')[0];

        if (!oScrollContainer.children.length) {
            return;
        }

        this.maxScrollHorizontal = oScrollContainer.scrollWidth - oScrollContainer.clientWidth;
        this.minScrollHorizontal = oScrollContainer.children ? oScrollContainer.children[0].offsetLeft : 0;
    }

    @HostListener('window:resize') onResize() {
        this.initScrollRanges();
    }

}
