import { Injectable } from '@angular/core';
import { Conf } from '../defines/conf';
import { DomSanitizer } from '@angular/platform-browser';

declare let $: any;
@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(
        public _conf: Conf,
        private _sanitized: DomSanitizer,

    ) { }

    public showStatusButton(statusVal: string): any {
        let result: string = '';

        let myBtn = this._conf.template.format.button.status[statusVal];
        result = `<button class="${myBtn.classes}">${myBtn.content}</button>`;
        return this._sanitized.bypassSecurityTrustHtml(result);
    }

    public showHistory(time: number): string {
        return `-- <span class="text-danger">${time}</span> --`;
    }

    public displayFileUploadName($event): void {
        $($event.target).next('.custom-file-label').html($event.target.value);
    }
}

