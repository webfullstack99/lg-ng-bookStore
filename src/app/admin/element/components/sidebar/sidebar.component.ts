import { Component, OnInit } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    private _isFirstLoad: boolean = true;

    constructor(
        public _conf: Conf
    ) { }

    ngOnInit(): void {
    }

    public getManagePageMenuClass(): object {
        if (this._isFirstLoad) {
            return {
                show: (screen.width >= 767.98),
            }
            this.firstLoaded();
        }
    }

    public getMainSidebarClass(): object {
        if (this._isFirstLoad) {
            return {
                toggled: (this.screenWidth <= 767.98),
            }
            this.firstLoaded();
        }
    }

    public firstLoaded(): void {
        this._isFirstLoad = false;
    }

    get screenWidth(): number {
        return screen.width;
    }

}
