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
    protected _controller: string;

    constructor(
        protected _db: AngularFireDatabase,
        private _uploadService: UploadService,
    ) {
        super(_db);
    }

    // MAIN METHODS ============
    public listItems(params: any, options: any, callback: (data) => void) {
        //this._db.list(this.collection(this._controller)).valueChanges().subscribe((data) => {
        //callback(data);
        //})

        this._db.list(this.collection(this._controller)).snapshotChanges().forEach((itemsSnapshot) => {
            let items: any[] = [];
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            callback(items);
        })
    }

    public saveItem(params: any, options: any) {
        switch (options.task) {
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
            this._db.object(`${this.collection(this._controller)}/${params.item.$key}`).remove();
        });
    }



    // SUPPORTED METHODS ============
    private insertOne(params: any, options: any): void {
        this._uploadService.upload(new Upload(params.item.thumb), this._controller, (upload: Upload) => {
            // upload done
            let item: IItem = {
                name: params.item.name,
                status: params.item.status,
                created: Date.now(),
                thumb: upload._url,
            }

            // save to db
            this._db.list(this.collection(this._controller)).push(item);
            if (typeof options.doneCallback == 'function') options.doneCallback(upload)

        }, (upload: Upload) => {
            // in progress
            options.progressCallback(upload);
        })
    }

    // SETTER & GETTER
    set controller(controller: string) {
        this._controller = controller;
    }

}
