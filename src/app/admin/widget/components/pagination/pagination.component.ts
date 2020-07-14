import { Component, OnInit, Input } from '@angular/core';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    providers: [PaginationService],

})
export class PaginationComponent implements OnInit {

    @Input('paginationData') _paginationData: any;
    @Input('controller') _controller: string;

    constructor(
        public _paginationService: PaginationService,
        private _urlService: UrlService,
        public _router: Router,
        public _conf: Conf,
    ) { }

    ngOnInit(): void {
        this._paginationService.init(this._paginationData);
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
}
