import { Injectable } from '@angular/core';
import { Upload } from '../defines/upload';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    constructor(
        //private _storage: AngularFireStorage
    ) { }

    public upload(upload: Upload, basePath: string, callback, progressCallback = null) {
        firebase.initializeApp(environment.firebase);
        let filePath = `${basePath}/${Date.now()}`;
        let fileRef = firebase.storage().ref(filePath);
        let task = fileRef.put(upload._file);

        task.on('state_changed', (snapshot) => {
            if (progressCallback) {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                upload._progress = percent;
                progressCallback(upload);
            }
        }, (error) => {
            console.log('upload error');
            console.log(error);

        }, () => {
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                upload._url = downloadURL;
                upload._name = upload._file.name;
                callback(upload);
            });
        })
    }

    public delete(downloadUrl) {
        //return this._storage.storage.refFromURL(downloadUrl).delete();
    }
}