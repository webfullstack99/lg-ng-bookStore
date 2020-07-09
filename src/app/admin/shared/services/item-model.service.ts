import { Injectable } from '@angular/core';
import { AdminModelService } from './admin-model.service';
import { disableDebugTools } from '@angular/platform-browser';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
    providedIn: 'root'
})
export class ItemModelService extends AdminModelService {
    protected _controller: string;

    set controller(controller: string) {
        this._controller = controller;
    }

    constructor(protected _db: AngularFireDatabase) {
        super(_db);
    }

    public listItems(params: object, options: object, callback: (data) => void) {
        //this._db.list(this.collection(this._controller)).valueChanges().subscribe((data) => {
        //callback(data);
        //})

        this._db.list(this.collection(this._controller)).snapshotChanges().forEach((itemsSnapshot) => {
            let items: object[] = [];
            itemsSnapshot.forEach((itemSnapshot) => {
                let item = itemSnapshot.payload.toJSON();
                item['$key'] = itemSnapshot.key;
                items.push(item);
            })
            callback(items);
        })
    }


}
