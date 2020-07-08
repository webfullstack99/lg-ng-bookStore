import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [UploadService],
})
export class FormComponent implements OnInit {

    public _basePath: string = '/items'
    public _items: any[];
    public _downloadURL: string;
    constructor(
        private _db: AngularFireDatabase,
        private _uploadServcie: UploadService,
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
        let result = this._uploadServcie.pushUpload(new Upload(imgFile), (upload) => {
            console.log(upload);
        });
    }

}
