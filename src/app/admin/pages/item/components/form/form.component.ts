import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    public _basePath: string = '/items'
    public _items: any[];
    constructor(private _db: AngularFireDatabase) {
    }

    ngOnInit(): void {
        this._db.list(this._basePath).valueChanges().subscribe((data) => {
            this._items = data;
        });
        let run = false;
        if (run) {
            this._db.list(this._basePath).remove();
            for (let i = 1; i <= 10; i++) {
                this._db.list(this._basePath).push({
                    name: `item ${i}`,
                })
            }
        }
    }

}
