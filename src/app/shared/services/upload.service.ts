import { Injectable } from '@angular/core';
import { Upload } from '../defines/upload';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from 'rxjs';
import { map, finalize } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    constructor(
        private _storage: AngularFireStorage
    ) { }

    public upload(upload: Upload, basePath: string, callback, progressCallback = null) {
        let filePath = `${basePath}/${Date.now()}`;
        let fileRef = this._storage.ref(filePath);
        let task = this._storage.upload(filePath, upload._file);
        task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    fileRef.getDownloadURL().subscribe(url => {
                        upload._url = url;
                        upload._name = upload._file.name;
                        callback(upload);
                    });
                })
            )
            .subscribe(snapshot => {
                if (progressCallback) {
                    let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    upload._progress = percent;
                    progressCallback(upload);
                }
            });
    }

    public delete
}
