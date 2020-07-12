import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseDatabase } from 'angularfire2';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
    protected _searchFields: string[];
    protected _sortFields: string[];
    protected _controller: string;

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

    // sync between collections
    /**
     * Syncs items ref
     * @param params - { items: any[], collection: string, fields:string[], path: string, newPath: string}
     * @param options 
     */
    protected syncItemsRef(params: any, options: any): void {
        let items = params.items;
        this.getItemsRef({
            items,
            collection: params.collection,
            fields: params.fields,
            path: params.path,
            doneCallback: (refItems) => {
                for (let refItem of refItems) {
                    items = items.map((item) => {
                        for (let field of params.fields)
                            if (item[field])
                                if (item[field][params.path] == refItem['$key']) item[field][params.newPath] = refItem;
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
                    this._db.object(`${data.collection}/${id}`).valueChanges().subscribe((data) => {
                        let item = data;
                        item['$key'] = id;
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
}
