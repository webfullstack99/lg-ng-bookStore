import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
    providedIn: 'root'
})
export class AdminModelService {
    constructor(
        protected _db: AngularFireDatabase,
    ) { }

    protected collection(controller: string): string {
        return `${controller}s`;
    }
}
