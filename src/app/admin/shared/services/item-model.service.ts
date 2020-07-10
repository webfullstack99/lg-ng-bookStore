import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { disableDebugTools } from '@angular/platform-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { IItem } from 'src/app/shared/defines/item.interface';

@Injectable({
    providedIn: 'root'
})
export class ItemModelService extends AdminModelService {
    constructor(
        protected _db: AngularFireDatabase,
        private _uploadService: UploadService,
    ) {
        super(_db);
    }

    // MAIN METHODS ============
    public listItems(params: any, options: any) {
        this._db.list(this.collection()).snapshotChanges().forEach((itemsSnapshot) => {
            let items: any[] = [];
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            options.doneCallback(items);
        })
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
        this._uploadService.deleteOneByUrl(params.item.thumb, () => {
            this._db.object(`${this.collection()}/${params.item.$key}`).remove();
        });
    }



    // SUPPORTED METHODS ============
    private updateByKey(params: any, options: any): void {
        params.item = this.setModified(params.item);
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            if (this.isFn(options.doneCallback)) options.doneCallback();
        })
    }

    private editChangeThumb(params: any, options: any): void {
        params.item = this.setModified(params.item);
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            params.item.thumb = upload._url;

            // delete old thumb
            this._uploadService.deleteOneByUrl(params.oldThumb);

            // update to db
            this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
                if (this.isFn(options.doneCallback)) options.doneCallback();
            })

        }, (upload: Upload) => {
            // in progress
            if (this.isFn(options.progressCallback)) options.progressCallback(upload);
        })
    }

    private editNotChangeThumb(params: any, options: any): void {
        params.item = this.setModified(params.item);
        this._db.object(`${this.collection()}/${params.key}`).update(params.item).then(() => {
            if (this.isFn(options.doneCallback)) options.doneCallback();
        })
    }

    private insertOne(params: any, options: any): void {
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            let item: IItem = {
                name: params.item.name,
                status: params.item.status,
                thumb: upload._url,
            }

            // set created
            item = this.setCreated(item);

            // save to db
            this._db.list(this.collection()).push(item).then(() => {
                if (this.isFn(options.doneCallback)) options.doneCallback(upload)
            });

        }, (upload: Upload) => {
            // in progress
            if (this.isFn(options.progressCallback)) options.progressCallback(upload);
        })
    }
}
