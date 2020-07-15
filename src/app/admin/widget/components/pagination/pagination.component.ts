import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';
import { Conf } from 'src/app/shared/defines/conf';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    providers: [PaginationService],

})
export class PaginationComponent implements OnInit {

    @Input('paginationBehavior') _paginationBehavior: BehaviorSubject<any>;
    @Input('controller') _controller: string;
    @Input('showLastPage') _showLastPage: boolean = false;
    @Input('showTitle') _showTitle: boolean = false;

    constructor(
        public _paginationService: PaginationService,
        private _urlService: UrlService,
        public _router: Router,
        public _conf: Conf,
    ) { }

    ngOnInit(): void {
        this._paginationBehavior.subscribe((pagination) => {
            this._paginationService.init(pagination);
        })
    }

    public goTo(page: number): void {
        this._router.navigateByUrl(this._urlService.getUrl({ queryParams: { page } }, { task: 'set-query-params' }));
    }

    public isDisabled(btn: string): boolean {
        switch (btn) {
            case 'start':
            case 'prev':
                return (this._paginationService._currentPage <= 1);
            case 'end':
            case 'next':
                return (this._paginationService._currentPage >= this._paginationService._totalPage);
        }
    }

    public isShow(): boolean {
        if (this._paginationService._totalItems <= this._paginationService._itemsPerPage) return false;
        return true;
    }

    public isShowLastPage(): boolean {
        return (this._showLastPage && this._paginationService._currentPage < (this._paginationService._totalPage - (Math.ceil(this._paginationService._pageRange / 2)) + 1));

    }

    public getLastPageContent(): string {
        let content: string = `${this._paginationService._totalPage}`;
        if (this._paginationService._totalPage >= this._paginationService._originalData._pageRange)
            content = (this._paginationService._currentPage >= this._paginationService._totalItems - 2) ? content : `...${content}`;
        return content;
    }
}
