import { Injectable } from '@angular/core';
import { Conf } from '../defines/conf';
import { DomSanitizer } from '@angular/platform-browser';
import date from 'date-and-time';
import { formatDate } from '@angular/common';

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


    /**
     * Shows history
     * @param data {userId, time}
     * @returns history 
     */
    public showHistory(data: any): string {
        let result: string = '';
        if (data) {
            let timePatterns = this._conf.format.time;
            let shortTime = formatDate(data.time, timePatterns.short_time, this._conf.format.time.locale);
            let longTime = formatDate(data.time, timePatterns.long_time, this._conf.format.time.locale);
            result = ` <div>
                            <div title="${data.userId}"> <i class="far fa-user fa-fw"></i> ${this.limit(data.userId, 10)}</div>
                            <div title="${longTime}"> <i class="far fa-clock fa-fw"></i> ${shortTime}</div>
                        </div> `
            return result;
        }
    }


    /**
     * Shows action
     * @param data {controller, item}
     */
    public showAction(data: any){
        let result: string = '';
        return this._sanitized.bypassSecurityTrustHtml(`
                                <div class="one-row-buttons action-button-container">
                                    <button (click)="onEditClick(item)" class="btn btn-success btn-sm "><i
                                            class="far fa-pen"></i></button>
                                    <button (click)="onDeleteClick(item)" class="btn btn-danger btn-sm ml-1 "><i
                                            class="far fa-trash-alt"></i></button>
                                </div>
        `);
    }

    public displayFileUploadName($event): void {
        $($event.target).next('.custom-file-label').html($event.target.value);
    }

    public getNewStatusValue(status) {
        return (status === 'active') ? 'inactive' : 'active';
    }

    public limit(str: string, limitNumber: number): string {
        if (str.length > limitNumber) return str.substr(0, limitNumber) + '...';
        return str;
    }

    public ucfirst(str: string): string{
        if (str.length > 0) return `${str.slice(0,1).toUpperCase()}${str.slice(1)}`;
        return str
    }
}

