import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Schema } from '../defines/schema';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { Base64Upload } from 'src/app/shared/defines/base64-upload';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
    protected _syncDuplicationSubscriptions: any = {};
    protected _filterFields: string[];
    protected _selectFilter: any[];
    protected _searchFields: string[];
    protected _sortFields: string[];
    protected _controller: string;
    protected _schema: string[];

    constructor(
        protected _db: AngularFireDatabase,
        protected _helperService: HelperService,
        protected _uploadService: UploadService,
    ) { }

    // ABSTRACTION METHODS
    public listItems(params: any, options: any) { }

    public getItem(params: any, options: any) { }

    public saveItem(params: any, options: any) { }

    // GENERAL METHODS
    public listItemsDynamically(params: any, options: any): void {
        let refFn;
        switch (options.task) {
            case 'active':
                refFn = (ref: any) => {
                    return ref
                        .orderByChild('status')
                        .equalTo('active')
                }
                break;

            default:
                refFn = (ref: any) => ref
                break;
        }

        let subscription: Subscription = this._db.list(this.toCollection(params.controller), refFn)
            .snapshotChanges().subscribe((itemsSnapshot) => {
                let items: any = [];

                // add $key into each item
                itemsSnapshot.forEach((itemSnapshot) => {
                    let item = itemSnapshot.payload.toJSON();
                    item['$key'] = itemSnapshot.key;
                    items.push(item);
                })
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(items);
                subscription.unsubscribe();
            })

    }

    /**
     * Syncs duplication data
     * @param params - { oldItem, item }
     * @param options 
     */
    public syncDuplicationData(params: any, options: any): void {
        let subId: number = Date.now();
        this._syncDuplicationSubscriptions[subId] = [];
        let duplicationDataConf: any[] = this._helperService.getConf_duplicationDataConf(this._controller);
        this.print('duplication conf', duplicationDataConf)
        let promises: Promise<any>[] = [];
        if (duplicationDataConf.length > 0) {
            for (let item of duplicationDataConf) {
                let dataDupFields: string[] = [];
                let syncType: string = (Object.keys(params.item).length == 0) ? 'delete' : 'update';
                this.print('sync type', syncType)
                if (syncType == 'update') dataDupFields = this._helperService.intersect(params.editedFields, item.dupFields);
                if (dataDupFields.length > 0 || syncType == 'delete') {
                    // dup data
                    let dupData: any = this.getDupData(params.item, item.dupFields);

                    // update
                    for (let pos of item.positions) {
                        promises.push(this.getUpdateDuplicationPromise({
                            subId,
                            dupData,
                            oldItem: params.oldItem,
                            position: pos,
                            duplicationInfo: item,
                        }))
                    }
                }
            }

            Promise.all(promises)
                .then((result: any[]) => {
                    this.print(`result: `, result, subId, '\n');
                    if (this._helperService.isFn(options.doneCallback())) options.doneCallback();;

                    // unsubscribe
                    for (let item of this._syncDuplicationSubscriptions[subId]) item.unsubscribe();
                    this._syncDuplicationSubscriptions[subId] = [];


                })
        } else if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
    }

    /**
     * Gets update promise
     * @param data - {dupData, oldItem, position, duplicationInfo: {controller, fieldPath, positions: string[]}, }
     */
    public getUpdateDuplicationPromise(data: any): Promise<any> {
        return new Promise((resolve) => {
            let subscription = this._db.list(this.toCollection(data.duplicationInfo.controller), ref => ref
                .orderByChild(`${data.position}/${data.duplicationInfo.fieldPath}`)

                // search
                .equalTo(this._helperService.getVal(data.oldItem, data.duplicationInfo.fieldPath))
            ).snapshotChanges().subscribe((itemsSnapshot) => {
                this.print('items found', itemsSnapshot.length);
                if (itemsSnapshot.length > 0) {
                    let subPromises: Promise<any>[] = [];

                    // loop
                    itemsSnapshot.forEach((itemSnapshot) => {
                        subPromises.push(
                            new Promise((subResolve) => {
                                this._db.object(`${this.toCollection(data.duplicationInfo.controller)}/${itemSnapshot.key}`).update({
                                    [data.position]: data.dupData,
                                })
                                    .then(() => {
                                        subResolve(true);
                                    })
                                    .catch((error) => {
                                        subResolve(false);
                                    })
                            })
                        )
                    })
                    Promise.all(subPromises)
                        .then((result: any[]) => {
                            let count: number = 0;
                            for (let i = 0; i < result.length; i++) if (result[i] == true) count++;
                            let temp: string = `${data.duplicationInfo.controller} (${count})`
                            resolve(temp)
                        })
                } else resolve(null);
            })
            this._syncDuplicationSubscriptions[data.subId].push(subscription);
        })
    }

    // GET ALL SELECT FILTER DATA (LOCAL)
    public getAllSelectFilterData(items: any[]): any[] {
        let result: any[] = [];
        if (items.length > 0) {
            let analyzedResult: any = this.analyzeSelectFilterData(items);
            result = this.standardizeSelectedFilterData(analyzedResult);
        }
        return result;
    }

    public analyzeSelectFilterData(items: any[]): any {
        let result: any = {};
        for (let selectFilter of this._selectFilter) {
            let field: string = selectFilter.field;
            result[selectFilter.field] = {};
            for (let item of items) {
                let value: string = this._helperService.getVal(item, `${field}/${selectFilter.foreignField}`);
                if (result[field][value])
                    result[field][value].count += 1
                else
                    result[field][value] = {
                        name: this._helperService.getVal(item, `${field}/name/value`),
                        count: 1,
                    }
            }
        }
        return result;
    }

    public standardizeSelectedFilterData(analyzedResult: any): any[] {
        let result: Set<any> = new Set();
        for (let field in analyzedResult) {
            let data: any[] = [];
            for (let value in analyzedResult[field])
                data.push({ value, name: analyzedResult[field][value].name, count: analyzedResult[field][value].count });
            result.add({ field, data });
        }
        return [...result];
    }

    // GET ALL SELECT FILTER DATA (DATABASE)
    public getAllDbSelectData(doneCallback?: (data: any[]) => void): void {
        let promises: Promise<any>[] = [];
        if (this._selectFilter.length > 0) {
            for (let selectFilter of this._selectFilter) {
                promises.push(
                    new Promise((resolve) => {
                        this.getSelectData(selectFilter, {
                            doneCallback: (data: any[]) => {
                                resolve({ field: selectFilter.field, data: data });
                            }
                        })
                    })
                )
            }
            Promise.all(promises)
                .then((result: any[]) => {
                    if (this._helperService.isFn(doneCallback)) doneCallback(result);
                })
        } else {
            if (this._helperService.isFn(doneCallback)) doneCallback([]);
        }
    }

    public getSingleSelectDataByField(controller: string, field: string, doneCallback: (selectData: any) => void): void {
        this.getSelectData(this._helperService.getRelationFieldParams(controller, field), { doneCallback, })
    }

    /**
     * Gets select data
     * @param data - {field, foreignField}
     * @param [doneCallback] 
     */
    public getSelectData(selectFilter, options: any): void {
        let selectData: any = new Set();
        this.listItemsDynamically({ controller: selectFilter.field }, {
            task: options.task,
            doneCallback: (items: any[]) => {
                for (let item of items)
                    selectData.add({ value: this._helperService.getVal(item, selectFilter.foreignField), name: item.name.value });
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback([...selectData]);
            }
        });
    }

    // COUNT FILTER (LOCAL)
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
                        this.saveItem({
                            item
                        }, {
                            task: 'delete-by-key', doneCallback: () => {
                                resolve(true)
                            }
                        })
                    })
                )
            }
        } else if (data.task == 'change') {
            for (let item of items) {
                if (item[data.field] != data.value)
                    promises.push(
                        new Promise((resolve) => {
                            this.saveItem({
                                oldItem: item,
                                updateData: { [data.field]: data.value },
                                key: item.$key,
                                editedFields: [data.field],
                            }, {
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

    // GET ITEM
    protected getItemByKey(params: any, options: any) {
        let subscription: Subscription = this._db.object(`${this.collection()}/${params.key}`).valueChanges().subscribe((data: any) => {
            if (data) data.$key = params.key;
            options.doneCallback(data);
            subscription.unsubscribe();
        })
    }

    /**
     * Gets item by field path and value
     * @param params - { controller, fieldPath, value }
     * @param options - { doneCallback }
     */
    public getItemByFieldPathAndValue(params: any, options: any) {
        let value = (options.isSearch) ? params.value.toLowerCase() : params.value;
        let subscription: Subscription = this._db.list(`${this.toCollection(params.controller)}`, ref => ref
            .orderByChild(params.fieldPath)
            .equalTo(value)
        ).snapshotChanges().subscribe((itemsSnapshot) => {
            let items: any = [];
            // add $key into each item
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                if (options.hasKey)
                    item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            let item = (items[0]) ? items[0] : null;
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(item);
            subscription.unsubscribe();
        })
    }

    // UPDATE - EDIT -DELETE
    protected updateByKey(params: any, options: any): void {
        params.updateData = this.setModified(params.updateData);
        let item = { ...params.oldItem, ...params.updateData };
        this.print('update by key - params', params);

        this._db.object(`${this.collection()}/${params.key}`).update(params.updateData)
            .then(() => {
                this.syncDuplicationData({
                    ...params,
                    item
                }, {
                    doneCallback: () => {
                        if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
                    }
                })
            })
            .catch((error) => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(error);
            })
    }

    protected editChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        params.item = this.standardizeBeforeSaving(params.item);
        this._uploadService.base64Upload({ upload: new Base64Upload(params.item.thumb), basePath: this._controller }, {
            doneCallback: (upload: Upload) => {
                // upload done
                params.item.thumb = upload._url;

                // delete old thumb
                if (params.oldThumb) this._uploadService.deleteOneByUrl({ downloadUrl: params.oldThumb }, {});

                // update to db
                this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
                    // sync duplication data
                    this.syncDuplicationData({
                        ...params,
                    }, {
                        doneCallback: () => {
                            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(null, params.item);
                        }
                    })
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

        // update to db
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            // sync duplication data
            this.syncDuplicationData({
                ...params,
            }, {
                doneCallback: () => {
                    if (this._helperService.isFn(options.doneCallback)) options.doneCallback(null, params.item);
                }
            });
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


        this.syncDuplicationData({
            oldItem: params.item,
            item: {},
        }, {
            doneCallback: () => {
                // delete thumb if exists
                if (params.item.thumb)
                    this._uploadService.deleteOneByUrl({ downloadUrl: params.item.thumb }, { doneCallback: (error) => fn(error) })
                else fn();
            }
        })
    }

    // FILTER & SEARCH & SORT & PAGINATION
    protected runPropertyFilter(params: any, options: any): void {
        let items = params.items;
        items = items.filter((item) => {
            for (let key in params.clientFilter.filter) {
                let value = params.clientFilter.filter[key];
                if (value != 'all' && item[key] != value)
                    return this.filterSelect(item, key, value);
            }
            return true;
        })
        return items;
    }

    private filterSelect(item: any, field: string, value): boolean {
        for (let selectFilter of this._selectFilter)
            if (field == selectFilter.field)
                if (this._helperService.getVal(item, `${field}/${selectFilter.foreignField}`) == value) return true;
        return false;
    }

    protected runLocalFilter(params: any, options: any): any {
        params.items = this.runPropertyFilter(params, options);
        params.items = this.runLocalSearch(params, options);
        return params.items;
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

    // CHECK METHODS
    public checkExist(params: any, options: any) {
        this.getItemByFieldPathAndValue(params, {
            isSearch: true,
            hasKey: true,
            doneCallback: (item: any) => {
                let isExist: boolean = (item) ? true : false;
                if (isExist) isExist = (params.key == item.$key) ? false : isExist;
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(isExist);
            }
        });
    }

    // OTHER METHODS
    protected collection(): string {
        return this.toCollection(this._controller);
    }

    public toCollection(controller: string) {
        let temp = (controller.slice(-1) == 'y') ? controller.replace(/y$/, 'ie') : controller;
        return `${temp}s`;
    }

    protected setSchema(schema?: string[]): void {
        if (!schema) this._schema = new Schema()[this._controller];
        else this._schema = schema;

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

    // LOOKUP
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
    // END LOOKUP

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

    // GET METHODS
    protected getFieldPathForSearch(field: string): string {
        return (this._searchFields.includes(field)) ? `${field}/forSearch` : field;
    }

    // SET METHODS
    protected setCreated(item: any) {
        item.created = {
            time: Date.now(),
            user: {
                username: 'admin',
            }
        }
        return item;
    }

    protected setModified(item: any) {
        item.modified = {
            time: Date.now(),
            user: {
                username: 'admin',
            }
        }
        return item;
    }

    // GETTER AND SETTER
    set controller(controller: string) {
        this._controller = controller;
        this._searchFields = this._helperService.getConf_searchFields(this._controller);
        this._sortFields = this._helperService.getConf_sortArr(this._controller);
        this._filterFields = this._helperService.getConf_filterArr(this._controller);
        this._selectFilter = this._helperService.getConf_selectFilter(this._controller);
        this.setSchema();
    }

    get db(): AngularFireDatabase {
        return this._db;
    }

    public getDupDataByDataAndField(item: any, field: string): any {
        let dupData: any = {};
        let dupFields: string[] = this._helperService.getDupFields(field, this._controller);
        dupData = this.getDupData(item, dupFields);
        return dupData;

    }

    public getDupData(item: any, dupFields: string[]): any {
        let dupData: any = {};
        if (dupFields)
            for (let field of dupFields) {
                dupData[field] = item[field];
            }
        this.print('dup data', dupData);
        return dupData;
    }

    public print(...args): void {
        //console.log(...args);
    }
}