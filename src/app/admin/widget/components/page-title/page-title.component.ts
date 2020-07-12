import { Component, OnInit, Input } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
    selector: 'app-page-title',
    templateUrl: './page-title.component.html',
    styleUrls: ['./page-title.component.css']
})
export class PageTitleComponent implements OnInit {
    public _pageData: any;

    @Input('controller') _controller: string = 'title';
    @Input('pageType') _pageType: string;

    constructor(
        public _conf: Conf,
        public _router: Router,
        public _urlService: UrlService,
    ) { }

    ngOnInit(): void {
        this.initPageData();
    }

    public initPageData(): void {
        let pageTitle = `${this._controller} page`;
        switch (this._pageType) {
            case 'index':
                this._pageData = {
                    pageTitle,
                    btn: {
                        content: 'add',
                        route: 'form',
                    }
                }
                break;
            case 'form':
                this._pageData = {
                    pageTitle,
                    btn: {
                        content: 'back',
                        route: '',
                    }
                }
                break;
        }
    }

    public getBtnClass(): object {
        return {
            'btn': true,
            'btn-primary': this._pageType == 'index',
            'btn-dark': this._pageType == 'form',
        }
    }

    public onBtnClick(): void {
        let navigateArr: string[] = [this._conf.prefix.admin, this._controller, this._pageData.btn.route];
        this._router.navigate(this.getStandardNavigateArr(navigateArr), {
            queryParams: this._urlService.getQueryParamObj(),
        })
        this._urlService.getQueryParamObj();
    }

    private getStandardNavigateArr(navigateArr: string[]): string[] {
        return navigateArr.filter((value) => {
            if (value.trim() != '') return true;
        })
    }
}
