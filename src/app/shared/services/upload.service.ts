import { Injectable } from '@angular/core';
import { Upload } from '../defines/upload';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UploadService {

    constructor() {
        firebase.initializeApp(environment.firebase);
    }

    public upload(upload: Upload, basePath: string, callback, progressCallback = null) {
        let filePath = `${basePath}/${Date.now()}`;
        let fileRef = firebase.storage().ref(filePath);
        let task = fileRef.put(upload._file);

        task.on('state_changed', (snapshot) => {
            // In Progress 
            if (progressCallback) {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                upload._progress = percent;
                progressCallback(upload);
            }
        }, (error) => {
            // Error
            console.log('upload error');
            console.log(error);

        }, () => {
            // Done
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                upload._url = downloadURL;
                upload._name = upload._file.name;
                callback(upload);
            });
        })
    }

    public deleteOneByUrl(downloadUrl, doneCallback?: () => void) {
        // Create a reference to the file to delete
        let fileRef = firebase.storage().refFromURL(downloadUrl);

        // Delete the file
        fileRef.delete()
            .then(function () {
                if (typeof doneCallback == 'function') doneCallback();
            }).catch((error) => {
                console.log('Failed to delete file');
            });
    }
}