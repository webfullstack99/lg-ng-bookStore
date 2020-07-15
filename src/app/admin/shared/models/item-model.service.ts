import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
    providedIn: 'root'
})
export class ItemModelService extends AdminModelService {

    constructor(
        protected _db: AngularFireDatabase,
        protected _helperService: HelperService,
        protected _uploadService: UploadService,
    ) {
        super(_db, _helperService, _uploadService);
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
                this.getItemByKey(params, options);
                break;
        }
    }

    // @OVERRIDE
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

    // SUPPORTED METHODS ============
    private listForMainTable(params: any, options: any): void {
        this._db.list(this.collection(), ref => this.getSearchRef({ ...params, ref }, options)
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

            // before pagination callback
            if (this._helperService.isFn(options.beforePaginationCallback)) options.beforePaginationCallback(items.length);

            // paginate
            items = this.runLocalPagination({ ...params, ...{ items } }, {});

            // done
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(items);
        })
    }

    private insertOne(params: any, options: any): void {
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            let item: any = {
                name: {
                    value: params.item.name,
                    forSearch: params.item.name.toLowerCase(),
                },
                status: params.item.status,
                thumb: upload._url,
            }
            item = this.setCreated(item);
            this._db.list(this.collection()).push(item).then(() => {
                if (this._helperService.isFn(options.doneCallback)) options.doneCallback(upload)
            });
        }, (upload: Upload) => {
            // in progress
            if (this._helperService.isFn(options.progressCallback)) options.progressCallback(upload);
        })
    }
}