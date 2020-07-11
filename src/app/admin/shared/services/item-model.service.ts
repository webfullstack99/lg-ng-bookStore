import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { disableDebugTools } from '@angular/platform-browser';
import { AngularFireDatabase, QueryFn } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { IItem } from 'src/app/shared/defines/item.interface';
import { HelperService } from 'src/app/shared/services/helper.service';

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
        this._searchFields = ['name'];
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

            case 'delete-one':
                this.deleteOne(params, options);
                break;
        }
    }

    private deleteOne(params, options): void {
        this._db.object(`${this.collection()}/${params.item.$key}`).remove();
    }

    // SUPPORTED METHODS ============
    private listForMainTable(params: any, options: any): void {
        this._db.list(this.collection(), ref => this.runSearchFilter({ ...params, ref }, options)
        ).snapshotChanges().forEach((itemsSnapshot) => {
            let items: any = [];

            // add $key into each item
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            if (this._helperService.isFn(options.freshDataCallback)) options.freshDataCallback(items);

            items = this.runClientFilter({ ...params, ...{ items } }, {});
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(items);
        })
    }

    private runSearchFilter(params: any, option: any): any {
        let clientSearch = params.clientFilter.search;
        if (clientSearch.search_field != 'all') {
            return params.ref
                .orderByChild(`${clientSearch.search_field}/forSearch`)
                .startAt(clientSearch.search_value)
                .endAt(`${clientSearch.search_value}\uf8ff`)
        }
        return params.ref;
    }

    /**
     * Runs client filter (locally)
     * @param params 
     * @param options 
     * @returns client filter 
     */
    private runClientFilter(params: any, options: any): any {
        params.items = this.runPropertyFilter(params, options);
        return params.items;
    }

    private runPropertyFilter(params: any, options: any): void {
        let items = params.items;
        items = items.filter((item) => {
            for (let key in params.clientFilter.filter) {
                if (params.clientFilter.filter[key] != 'all')
                    if (item[key] != params.clientFilter.filter[key]) return false;
            }
            return true;
        })
        return items;

    }

    private updateByKey(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback();
        })
    }

    private editChangeThumb(params: any, options: any): void {
        params.item = this.syncForSearch(params.item);
        params.item = this.setModified(params.item);
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
