import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';
import { IBook } from 'src/app/shared/defines/book.interface';
import { Base64Upload } from 'src/app/shared/defines/base64-upload';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookModelService extends AdminModelService {

    public _listSubscription: Subscription;

    constructor(
        protected _db: AngularFireDatabase,
        protected _helperService: HelperService,
        protected _uploadService: UploadService,
    ) {
        super(_db, _helperService, _uploadService);
    }

    // MAIN METHODS ============
    // @OVERRIDE
    public listItems(params: any, options: any) {
        switch (options.task) {
            case 'list-for-main-table':
                this.listForMainTable(params, options);
                break;
        }
    }

    // @OVERRIDE
    public getItem(params: any, options: any) {
        switch (options.task) {
            case 'by-field-path-and-value':
                this.getItemByFieldPathAndValue({ ...params, controller: this._controller }, options);
                break;
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
        ).snapshotChanges().subscribe((itemsSnapshot) => {
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
            if (this._helperService.isFn(options.beforePaginationCallback)) options.beforePaginationCallback(items);

            // paginate
            items = this.runLocalPagination({ ...params, ...{ items } }, {});

            // done
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(items);
        })
    }

    private insertOne(params: any, options: any): void {
        this._uploadService.base64Upload({ upload: new Base64Upload(params.item.thumb), basePath: this._controller }, {
            doneCallback: (upload: Upload) => {
                try {
                    this.getItemByFieldPathAndValue({
                        controller: 'category',
                        fieldPath: 'slug',
                        value: params.item.category
                    }, {
                        doneCallback: (data: any) => {
                            let item: IBook = {
                                title: {
                                    value: params.item.title,
                                    forSearch: params.item.title.toLowerCase(),
                                },
                                author: {
                                    value: params.item.author,
                                    forSearch: params.item.author.toLowerCase(),
                                },
                                description: {
                                    value: params.item.description,
                                    forSearch: params.item.description.toLowerCase(),
                                },
                                slug: params.item.slug,
                                category: data,
                                price: params.item.price,
                                status: params.item.status,
                                special: params.item.special,
                                saleOff: params.item.saleOff,
                                thumb: upload._url,
                            }
                            item = this.setCreated(item);
                            this._db.list(this.collection()).push(item)
                                .then(() => { if (this._helperService.isFn(options.doneCallback)) options.doneCallback() })
                                .catch((e) => { if (this._helperService.isFn(options.doneCallback)) options.doneCallback(e) });
                        }
                    })
                    // upload done
                } catch (e) { if (this._helperService.isFn(options.doneCallback)) options.doneCallback(e) }
            },
            progressCallback: (upload: Upload) => {
                // in progress
                if (this._helperService.isFn(options.progressCallback)) options.progressCallback(upload);
            }
        })
    }
}
