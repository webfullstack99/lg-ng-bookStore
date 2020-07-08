import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from 'rxjs';
import { map, finalize } from "rxjs/operators";

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [AngularFireStorage],
})
export class FormComponent implements OnInit {

    public _basePath: string = '/items'
    public _items: any[];
    public _downloadURL: string;
    constructor(
        private _db: AngularFireDatabase,
        private _storage: AngularFireStorage
    ) {
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

    public onUpload($event): void {
        let imgFile = $event.target.files[0];
        let filePath = `item/img-${Date.now()}`;
        let fileRef = this._storage.ref(filePath);
        let task = this._storage.upload(filePath, imgFile);
        task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe(url => {
                        if (url) {
                            this._downloadURL = url;
                            console.log(url);
                        }
                    });
                })
            )
            .subscribe(snapshot => {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`${(percent).toFixed(2)}%`);
            });
    }

}
