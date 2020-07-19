import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseDatabase } from 'angularfire2';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Schema } from '../defines/schema';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
    protected _searchFields: string[];
    protected _sortFields: string[];
    protected _controller: string;
    protected _schema: string[];

    constructor(
        protected _db: AngularFireDatabase,
        protected _helperService: HelperService,
        protected _uploadService: UploadService,
    ) { }

    // GENERAL ===========
    protected getItemByKey(params: any, options: any) {
        this._db.object(`${this.collection()}/${params.key}`).valueChanges().subscribe((data: any) => {
            if (data) data.$key = params.key;
            options.doneCallback(data);
        })
    }

    public getItemByFieldPathAndValue(params: any, options: any) {
        this._db.list(`${this.toCollection(params.controller)}`, ref => ref
            .orderByChild(params.fieldPath)
            .equalTo(params.value)
        ).snapshotChanges().forEach((itemsSnapshot) => {
            let items: any = [];

            // add $key into each item
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            let item = (items[0]) ? items[0] : null;
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(item);
        })
    }

    public checkExist(params: any, options: any) {
        this.getItemByFieldPathAndValue(params, {
            doneCallback: (item: any) => {
                let isExist: boolean = (item) ? true : false;
                if (isExist) isExist = (params.key == item.$key) ? false : isExist;
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(isExist);
            }
        });
    }

    protected updateByKey(params: any, options: any): void {
        params.updateData = this.setModified(params.updateData);
        this._db.object(`${this.collection()}/${params.key}`).update(params.updateData)
            .then(() => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
            })
            .catch((error) => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(error);
            })
    }

    protected editChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        params.item = this.standardizeBeforeSaving(params.item);
        this._uploadService.upload({ upload: new Upload(params.item.thumb), basePath: this._controller }, {
            doneCallback: (upload: Upload) => {
                // upload done
                params.item.thumb = upload._url;

                // delete old thumb
                this._uploadService.deleteOneByUrl({ downloadUrl: params.oldThumb }, {});

                // update to db
                this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
                    if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
                })
            },
            progressCallback: (upload: Upload) => {
                // in progress
                if (this._helperService.isFn(options.progressCallback)) options.progressCallback(upload);
            }
        })
    }

    protected editNotChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        params.item = this.standardizeBeforeSaving(params.item);
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            if (this._helperService.isFn(options.doneCallback)) {
                options.doneCallback();
            }
        })
    }

    protected deleteByKey(params, options): void {
        let fn = (error?): void => {
            if (!error) {
                this._db.object(`${this.collection()}/${params.item.$key}`).remove()
                    .then(() => {
                        if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
                    })
                    .catch((error) => {
                        if (this._helperService.isFn(options.doneCallback)) options.doneCallback(error);
                    })
            } else if (this._helperService.isFn(options.doneCallback)) options.doneCallback(error);
        }

        // delete thumb if exists
        if (params.item.thumb)
            this._uploadService.deleteOneByUrl({ downloadUrl: params.item.thumb }, { doneCallback: (error) => fn(error) })
        else fn();
    }

    protected getSearchRef(params: any, options: any): any {
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

    protected runLocalFilter(params: any, options: any): any {
        params.items = this.runPropertyFilter(params, options);
        params.items = this.runLocalSearch(params, options);
        return params.items;
    }

    protected runLocalSearch(params: any, options: any): any {
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

    protected runLocalPagination(params: any, options: any): any {
        let items: any[] = params.items;
        let page: number = this._helperService.getValidPageNumber({
            totalItems: items.length,
            page: params.clientFilter.other.page,
            ...params.pagination,
        });
        let start: number = ((page - 1) * params.pagination.itemsPerPage);
        let end: number = params.pagination.itemsPerPage + start;
        return items.slice(start, end);
    }

    protected runLocalSort(params: any, options: any): any {
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
                let aVal: number = a.created.time;
                let bVal: number = b.created.time;
                return -(aVal - bVal);
            })
        }
        return items;
    }

    protected runPropertyFilter(params: any, options: any): void {
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


    // END GENERAL ========

    protected collection(): string {
        return this.toCollection(this._controller);
    }

    public toCollection(controller: string) {
        let temp = (controller.slice(-1) == 'y') ? controller.replace(/y$/, 'ie') : controller;
        return `${temp}s`;
    }

    protected setCreated(item: any) {
        item.created = {
            time: Date.now(),
            user: {
                time: 1594370898380,
                status: 'active',
                username: 'admin',
            }
        }
        return item;
    }

    protected setModified(item: any) {
        item.modified = {
            time: Date.now(),
            user: {
                time: 1594370898380,
                status: 'active',
                username: 'admin',
            }
        }
        return item;
    }

    set controller(controller: string) {
        this._controller = controller;
        this._searchFields = this._helperService.getConf_searchFields(this._controller);
        this._sortFields = this._helperService.getConf_sortArr(this._controller);
        this.setSchema();
    }

    protected setSchema(schema?: string[]): void {
        if (!schema) this._schema = new Schema()[this._controller];
        else this._schema = schema;

    }

    get db(): AngularFireDatabase {
        return this._db;
    }

    public pushData(jsonStr: string) {
        let items = JSON.parse(jsonStr);
        this._db.list(this.collection()).remove().then(() => {
            for (let item of items) {
                this._db.list(this.collection()).push(item);
            }
        });
    }

    protected syncForSearch(item: any): any {
        for (let field of this._searchFields) {
            if (typeof item[field] == 'string') {
                let value = item[field];
                item[field] = {
                    value,
                    forSearch: value.toLowerCase(),
                }
            } else {
                if (item[field].value.toLowerCase().localeCompare(item.name.forSearch) != 0) {
                    item[field].forSearch = item[field].value.toLowerCase();
                }
            }
        }
        return item;
    }

    /**
     * Syncs items ref
     * @param params - { items: any[], from: string, localFields:string[], localPath: string - ref to localFields, newPath?: string}
     * @param options 
     */
    protected lookup(params: any, options: any): void {
        let items = params.items;
        this.getItemsRef({
            items,
            collection: params.from,
            fields: params.localFields,
            foreignField: params.foreignField,
            path: params.localPath,
            doneCallback: (refItems) => {
                for (let refItem of refItems) {
                    items = items.map((item) => {
                        for (let field of params.localFields)
                            if (item[field])
                                if (item[field][params.localPath] == refItem[params.foreignField]) {
                                    if (params.newPath) item[field][params.newPath] = refItem;
                                    else item[field][params.localPath] = refItem;
                                }
                        return item;
                    })
                }
                options.doneCallback(items);
            }
        })
    }

    /**
     * Gets items ref
     * @param data {items, collection, fields, path, doneCallback}
     */
    protected getItemsRef(data): void {
        let promises: Promise<any>[] = [];
        let ids: string[] = this.getIdsRef(data.items, data.fields, data.path);
        for (let id of ids) {
            promises.push(
                new Promise((resolve) => {
                    this._db.object(`${data.collection}/${id}`).valueChanges().subscribe((result) => {
                        let item = result;
                        item[data.foreignField] = id;
                        resolve(item);
                    });
                })
            )
        }
        Promise.all(promises)
            .then((items) => {
                if (this._helperService.isFn(data.doneCallback)) data.doneCallback(items);
            })

    }

    protected getIdsRef(items: any[], fields: string[], path: string): string[] {
        let ids: string[] = [];
        for (let item of items) {
            for (let field of fields) {
                if (item[field]) {
                    let id = this._helperService.getVal(item[field], path);
                    if (id)
                        if (!ids.includes(id)) ids.push(id);
                }
            }
        }
        return ids;
    }

    protected standardizeBeforeSaving(item: any) {
        let itemTemp = { ...item };
        for (let key in itemTemp) {
            if (!this._schema.includes(key)) {
                let flag: boolean = true;
                if (typeof itemTemp[key] === 'object' && itemTemp != null) {
                    for (let subKey in itemTemp[key]) {
                        let tempPath = `${key}.${subKey}`;
                        if (this._schema.includes(tempPath)) flag = false;
                        else delete itemTemp[key][subKey];
                    }
                }
                if (flag) delete itemTemp[key];
            }
        }
        return itemTemp;
    }

    public countFilter(items: any[]) {
        let filterCount: any = {};
        let filterArr = this._helperService.getConf_filterArr(this._controller);
        for (let filter of filterArr) {
            filterCount[filter] = {};
            for (let item of items)
                if (filterCount[filter][item[filter]]) filterCount[filter][item[filter]]++;
                else filterCount[filter][item[filter]] = 1;

            let total: number = 0;
            for (let key in filterCount[filter]) total += filterCount[filter][key];
            filterCount[filter].all = total;
        }
        return filterCount;
    }

    /**
     * Determines whether multi task on
     * @param data - {task, value}
     */
    public changeMulti(data: any, items: any[], doneCallback?: (affectedRows: number) => void): void {
        let promises: Promise<boolean>[] = [];
        if (data.task == 'delete') {
            for (let item of items) {
                promises.push(
                    new Promise((resolve) => {
                        this.saveItem({ item }, {
                            task: 'delete-by-key', doneCallback: () => { resolve(true); }
                        })
                    })
                )
            }
        } else if (data.task == 'change') {
            for (let item of items) {
                if (item[data.field] != data.value)
                    promises.push(
                        new Promise((resolve) => {
                            this.saveItem({ updateData: { [data.field]: data.value }, key: item.$key }, {
                                task: 'update-by-key', doneCallback: () => {
                                    resolve(true);
                                }
                            });
                        })
                    )
            }
        }
        Promise.all(promises)
            .then((result: any[]) => {
                if (this._helperService.isFn(doneCallback)) doneCallback(result.length);
            })
    }

    // ABSTRACTION METHODS
    public listItems(params: any, options: any) { }

    public getItem(params: any, options: any) { }

    public saveItem(params: any, options: any) { }
}
