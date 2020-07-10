import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseDatabase } from 'angularfire2';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
    protected _controller: string;

    constructor(
        protected _db: AngularFireDatabase,
    ) { }

    protected collection(): string {
        return `${this._controller}s`;
    }

    protected isFn(fn: any): boolean {
        if (typeof fn == 'function') return true;
        return false;
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

}
