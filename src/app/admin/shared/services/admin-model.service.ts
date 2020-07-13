import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseDatabase } from 'angularfire2';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Schema } from '../defines/schema';

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
    ) { }

    protected collection(): string {
        return `${this._controller}s`;
    }

    protected setCreated(item: any) {
        let userId: string = '-MBruIHFZL-VKjuO-qMv';
        item.created = {
            userId,
            time: Date.now(),
        }
        return item;
    }

    protected setModified(item: any) {
        let userId: string = '-MBruIHFZL-VKjuO-qMv';
        item.modified = {
            userId,
            time: Date.now(),
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

    // Lookup 
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
    public changeMulti(data: any, items: any[], doneCallback?: () => void): void {
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
                //if (item[data.field] != data.value)
                    promises.push(
                        new Promise((resolve) => {
                            this.saveItem({ updateData: { [data.field]: data.value }, key: item.$key }, {
                                task: 'update-by-key', doneCallback: () => { resolve(true); }
                            });
                        })
                    )
            }
        }
        Promise.all(promises)
            .then((result) => {
                if (this._helperService.isFn(doneCallback)) doneCallback();
            })
    }

    public saveItem(params: any, options: any) { }
}
