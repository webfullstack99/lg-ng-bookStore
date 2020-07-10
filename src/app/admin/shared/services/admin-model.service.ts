import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseDatabase } from 'angularfire2';
import { HelperService } from 'src/app/shared/services/helper.service';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
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
}
