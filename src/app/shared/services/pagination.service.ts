import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    public _itemsPerPage: number;
    public _pageRange: number;
    public _totalItems: number;
    public _totalPage: number;
    public _currentPage: number;
    public _startAt: number;
    public _endAt: number;
    public _pageArr: number[];


    constructor(
        private _urlService: UrlService,
    ) { }


    /**
     * Inits pagination service
     * @param data - {itemsPerPage, pageRange, totalItems, currentPage}
     */
    public init(paginationData: any): void {
        this._itemsPerPage = paginationData.itemsPerPage || 5;
        this._totalItems = paginationData.totalItems || 0;
        this._totalPage = Math.ceil(paginationData.totalItems / paginationData.itemsPerPage);
        this._urlService.subscribeQueryParams((data) => {
            this.setCurrentPage(data.page);
            this.setPageRange(paginationData.pageRange);
            this.running();
        })
    }

    private setCurrentPage(n: string): void {
        if (n) {
            let page: number = Number.parseInt(n);
            page = (Number.isNaN(page) || page <= 0) ? 1 : page;
            page = (page > this._totalPage) ? this._totalPage : page;
            this._currentPage = page;
        } else this._currentPage = 1;
    }

    private setPageRange(n: number): void {
        let pageRange: number = (this._totalPage <= n) ? this._totalPage : n;
        this._pageRange = ((pageRange % 2 == 0)) ? pageRange - 1 : pageRange;
    }

    public running(): void {
        //this.showInfo();
        this._startAt = this.getStartPage();
        this._endAt = this.getEndPage();
        this.createPageArr();

    }

    private getEndPage(): number {
        let endAt: number;
        if (this._totalPage >= this._pageRange) endAt = this._startAt + this._pageRange - 1;
        else endAt = this._pageRange;
        return endAt;
    }

    private createPageArr(): void {
        this._pageArr = [];
        for (let i = this._startAt; i <= this._endAt; i++)
            this._pageArr.push(i);
    }

    private getStartPage(): number {
        let startAt: number;
        let temp: number = Math.ceil(this._pageRange / 2); // 1

        if (this._currentPage <= temp) startAt = 1;
        else if (this._currentPage > (this._totalPage - (temp - 1))) {
            startAt = this._totalPage - temp;
        }
        else startAt = this._currentPage - temp + 1;
        return startAt;
    }

    public showInfo(): void {
        console.log('items per page');
        console.log(this._itemsPerPage);
        console.log('total items');
        console.log(this._totalItems);
        console.log('total page');
        console.log(this._totalPage);
        console.log('page range');
        console.log(this._pageRange);
        console.log('current page');
        console.log(this._currentPage);
    }

}