import { Injectable } from '@angular/core';
import { Conf } from '../defines/conf';
import { DomSanitizer } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { NotifierService } from 'angular-notifier';

declare let $: any;

@Injectable({
    providedIn: 'root'
})
export class HelperService {

    constructor(
        public _conf: Conf,
        private _sanitized: DomSanitizer,
        private _notifier: NotifierService,
    ) { }

    public showStatusButton(statusVal: string): any {
        let result: string = '';

        let myBtn = this._conf.template.format.button.status[statusVal];
        result = `<button class="status-btn ${myBtn.classes}">${myBtn.content}</button>`;
        return this._sanitized.bypassSecurityTrustHtml(result);
    }

    /**
     * Shows history
     * @param data {time, user}
     * @returns history 
     */
    public showHistory(data: any): any {
        let result: string = '';
        if (data) {
            let timePatterns = this._conf.format.time;
            let shortTime = formatDate(data.time, timePatterns.short_time, this._conf.format.time.locale);
            let longTime = formatDate(data.time, timePatterns.long_time, this._conf.format.time.locale);
            let username = this.getVal(data, 'user.username');
            let userStr = (username) ? `<div> <i class="far fa-user fa-fw"></i> ${username}</div>` : '';
            let timeStr = `<div title="${longTime}"> <i class="far fa-clock fa-fw"></i> ${shortTime}</div>`;
            result = ` <div>${userStr} ${timeStr}</div> `
            return this._sanitized.bypassSecurityTrustHtml(result);
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

    public getConf_filterArr(controller: string): string[] {
        return this._conf.templateConf[controller].filter;
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
        let pathArr: string[];
        if (path.indexOf('.') > -1) pathArr = path.split('.');
        else pathArr = [path];
        try {
            for (let value of pathArr) {
                result = temp[value];
                temp = result;
            }
        } catch{ return '' }
        return result;
    }

    public toHtml(string: string): any {
        return this._sanitized.bypassSecurityTrustHtml(string);
    }

    public selectAllItems(): void {
        $('.table-row-checkbox').prop('checked', true);
    }

    public unSelectAllItems(): void {
        $('.table-row-checkbox').prop('checked', false);
    }

    public selectItems(items: any[]): void {
        for (let item of items)
            $(`input#${item.$key}`).prop('checked', true);
    }


    /**
     * Syncs select items with changes
     * @param items 
     * @param data - {task, value}
     * @returns select items with changes 
     */
    public syncSelectItemsWithChanges(items: any[], data: any): any[] {
        return items.map((item) => {
            item[data.field] = data.value;
            return item;
        })
    }


    /**
     * Gets valid page
     * @param data - {itemsPerPage, pageRange, totalItems, page}
     */
    public getValidPageNumber(data: any): number {
        let page: number = 1;
        if (data.page) {
            let totalPage = (!data.totalPage) ? Math.ceil(data.totalItems / data.itemsPerPage) : data.totalPage;
            page = Number.parseInt(data.page);
            page = (Number.isNaN(page) || page <= 0) ? 1 : page;
            page = (page > totalPage) ? totalPage : page;
        }
        return page;
    }

    public setDefaultTextForCustomFileInput(): void {
        $('.img-file-input').text(this.ucfirst(this.getConf_text('chooseFile')));
    }

    public notifier(params: any, task: string): void {
        switch (task) {
            case 'show':
                this._notifier.show(params.notifierData)
                break;

            case 'hide-by-id':
                this._notifier.hide(params.id)
                break;

            case 'hide-all':
                this._notifier.hideAll()
                break;
        }
    }

    public getNotifierId(id: string): string {
        if (id) return `${id}_notifier`;
    }
}