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
        result = `<button class="status-btn ${myBtn.classes}">${myBtn.content}</button>`;
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

    public ucfirst(str: string): string {
        if (str.length > 0) return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
        return str
    }

    public getConf_text(val: string): string {
        return this._conf.template.format.text[val];
    }

    public getConf_btnTemplate(): any {
        return this._conf.template.format.button;
    }

    public getConf_sortArr(controller: string): string[] {
        return this._conf.templateConf[controller].sort;
    }

    public getConf_searchArr(controller: string): string[] {
        return this._conf.templateConf[controller].search;
    }

    public getConf_searchTemplate(): any {
        return this._conf.template.format.search;
    }

    public getConf_selectData(): any {
        return this._conf.template.selectData;
    }

    public getConf_searchFields(controller: string): string[] {
        let searchFields = [...this._conf.templateConf[controller].search]
        let allIndex = searchFields.indexOf('all');
        if (allIndex > -1) searchFields.splice(allIndex, 1);
        return searchFields;
    }

    public getTemplateConf(controller: string): any {
        return this._conf.templateConf[controller];
    }

    public isFn(fn: any): boolean {
        if (typeof fn == 'function') return true;
        return false;
    }

    public removeKeyInItems(items: any): any {
        let tempItems = [];
        for (let item of items) {
            tempItems.push({ ...item });
        }
        for (let item of tempItems) {
            delete item.$key;
        }
        return tempItems;
    }

    public cloneArray(items: any[]): any[] {
        return items.slice(0);
    }

    public cloneObj(item: object): any {
        return { ...item };
    }

    public getVal(item: any, path: string): any {
        let result: any;
        let temp: any = item;
        let pathArr: string[] = path.split('.');
        if (!pathArr) pathArr = [path];
        try {
            for (let value of pathArr) {
                result = temp[value];
                temp = result;
            }
        } catch{ return '' }
        return result;
    }
}

