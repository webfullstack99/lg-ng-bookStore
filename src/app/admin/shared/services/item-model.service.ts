import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { disableDebugTools } from '@angular/platform-browser';
import { AngularFireDatabase, QueryFn } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { IItem } from 'src/app/shared/defines/item.interface';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ɵInternalFormsSharedModule } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ItemModelService extends AdminModelService {

    constructor(
        protected _db: AngularFireDatabase,
        protected _helperService: HelperService,
        private _uploadService: UploadService,
    ) {
        super(_db, _helperService);
    }

    // MAIN METHODS ============
    public listItems(params: any, options: any) {
        switch (options.task) {
            case 'list-for-main-table':
                this.listForMainTable(params, options);
                break;
        }
    }

    public getItem(params: any, options: any) {
        switch (options.task) {
            case 'by-key':
                this._db.object(`${this.collection()}/${params.key}`).valueChanges().subscribe((data: IItem) => {
                    if (data) data.$key = params.key;
                    options.doneCallback(data);
                })
                break;
        }

    }

    // Override
    public saveItem(params: any, options: any) {
        switch (options.task) {
            case 'update-by-key':
                this.updateByKey(params, options);
                break;

            case 'edit-change-thumb':
                this.editChangeThumb(params, options);
                break;

            case 'edit-not-change-thumb':
                this.editNotChangeThumb(params, options);
                break;

            case 'insert-one':
                this.insertOne(params, options);
                break;

            case 'delete-by-key':
                this.deleteByKey(params, options);
                break;
        }
    }

    private deleteByKey(params, options): void {
        this._uploadService.deleteOneByUrl(params.item.thumb, () => {
            this._db.object(`${this.collection()}/${params.item.$key}`).remove()
                .then(() => {
                    if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
                });
        })
    }

    // SUPPORTED METHODS ============
    private listForMainTable(params: any, options: any): void {
        this._db.list(this.collection(),
            (ref) => {
                ref = this.getSearchRef({ ...params, ref }, options)
                ref = this.getSortRef({ ...params, ref }, options)
                return ref;
            }
        ).snapshotChanges().forEach((itemsSnapshot) => {
            let items: any = [];

            // add $key into each item
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            if (this._helperService.isFn(options.freshDataCallback)) options.freshDataCallback(items);

            items = this.runLocalFilter({ ...params, ...{ items } }, {});
            items = this.runLocalSort({ ...params, ...{ items } }, {});
            items = this.runLocalPagination({ ...params, ...{ items } }, {});
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(items);
        })
    }

    private getSearchRef(params: any, options: any): any {
        let field = params.clientFilter.search.search_field;
        let value = params.clientFilter.search.search_value.toLowerCase();
        if (this._searchFields.includes(field)) {
            if (value.trim() != '') {
                if (field != 'all') {
                    return params.ref
                        .orderByChild(`${field}/forSearch`)
                        .startAt(value)
                        .endAt(`${value}\uf8ff`)
                }
            }
        }
        return params.ref;
    }

    private getSortRef(params: any, options: any): any {
        let field = params.clientFilter.sort.sort_field;
        let order = params.clientFilter.sort.sort_order;
        let total = 10;
        //if (this._sortFields.includes(field)) {
        //if (value == 'desc') return params.ref.limitToLast()   
        //if (value == 'as')

        //}
        return params.ref;
    }

    private runLocalFilter(params: any, options: any): any {
        params.items = this.runPropertyFilter(params, options);
        params.items = this.runLocalSearch(params, options);
        return params.items;
    }

    private runLocalSearch(params: any, options: any): any {
        let items = params.items;
        let searchField = params.clientFilter.search.search_field;
        let searchValue = params.clientFilter.search.search_value;

        if (searchField.trim() != '' && searchValue.trim() != '') {
            if (searchField == 'all') {
                items = items.filter((item) => {
                    for (let field of this._searchFields) {
                        if (item[field])
                            if (item[field].forSearch.indexOf(searchValue.toLowerCase()) > -1)
                                return true;
                    }
                    return false;
                })
            }
        }
        return items;
    }

    private runLocalPagination(params: any, options: any): any {
        let items = params.items;
        //console.log('pagination');
        //console.log(params);
        return items;
    }

    private runLocalSort(params: any, options: any): any {
        let items = params.items;
        let field = params.clientFilter.sort.sort_field;
        let order = params.clientFilter.sort.sort_order;
        if (this._sortFields.includes(field) && ['desc', 'asc'].includes(order)) {
            items = items.sort((a, b) => {
                let aPath: string;
                let bPath: string;
                if (['created', 'modified',].includes(field)) {
                    aPath = `${field}.time`;
                    bPath = `${field}.time`;
                } else {
                    aPath = (this._searchFields.includes(field)) ? `${field}.forSearch` : field;
                    bPath = (this._searchFields.includes(field)) ? `${field}.forSearch` : field;
                }
                let aVal = this._helperService.getVal(a, aPath);
                let bVal = this._helperService.getVal(b, bPath);
                let comparison: number = (typeof aVal == 'string') ? aVal.localeCompare(bVal) : (aVal - bVal);
                return (order == 'asc') ? comparison : -comparison;
            })
        } else {
            items = items.sort((a, b) => {
                let aVal: string = a.$key;
                let bVal: string = b.$key;
                return -(aVal.localeCompare(bVal));
            })
        }
        return items;
    }

    private runPropertyFilter(params: any, options: any): void {
        let items = params.items;
        items = items.filter((item) => {
            for (let key in params.clientFilter.filter) {
                if (params.clientFilter.filter[key] != 'all') {
                    if (item[key] != params.clientFilter.filter[key]) {
                        return false;
                    } else {
                    }
                }
            }
            return true;
        })
        return items;

    }

    private updateByKey(params: any, options: any): void {
        params.updateData = this.setModified(params.updateData);
        this._db.object(`${this.collection()}/${params.key}`).update(params.updateData).then(() => {
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
        })
    }

    private editChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        params.item = this.standardizeBeforeSaving(params.item);
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            params.item.thumb = upload._url;

            // delete old thumb
            this._uploadService.deleteOneByUrl(params.oldThumb);

            // update to db
            this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
            })

        }, (upload: Upload) => {
            // in progress
            if (this._helperService.isFn(options.progressCallback)) options.progressCallback(upload);
        })
    }

    private editNotChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        params.item = this.standardizeBeforeSaving(params.item);
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
        })
    }

    private insertOne(params: any, options: any): void {
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            let item: IItem = {
                name: {
                    value: params.item.name,
                    forSearch: params.item.name.toLowerCase(),
                },
                status: params.item.status,
                thumb: upload._url,
            }

            // set created
            item = this.setCreated(item);

            // save to db
            this._db.list(this.collection()).push(item).then(() => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(upload)
            });

        }, (upload: Upload) => {
            // in progress
            if (this._helperService.isFn(options.progressCallback)) options.progressCallback(upload);
        })
    }
}
