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

    /**
     * Uploads upload service
     * @param params - {basePath, upload}
     * @param options - { progressCallback?, doneCallBack}
     */
    public base64Upload(params: any, options: any): void {
        let filePath = `${params.basePath}/${Date.now()}`;
        let fileRef = firebase.storage().ref(filePath);
        let base64 = this.solveBase64String(params.upload._base64);
        let task = fileRef.putString(base64, 'base64', { contentType: 'image/jpg' });

        task.on('state_changed', (snapshot) => {
            // In Progress 
            if (options.progressCallback) {
                let percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                params.upload._progress = percent;
                options.progressCallback(params.upload);
            }
        }, (error) => {
            // Error
            console.log('upload error');
            console.log(error);

        }, () => {
            // Done
            task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                params.upload._url = downloadURL;
                options.doneCallback(params.upload);
            });
        })
    }

    public deleteOneByUrl(params: any, options: any) {
        // Create a reference to the file to delete
        try {
            let fileRef = firebase.storage().refFromURL(params.downloadUrl);

            // Delete the file
            fileRef.delete()
                .then(function () {
                    if (typeof options.doneCallback == 'function') options.doneCallback();
                }).catch((error) => {
                    console.log('Failed to delete file');
                    if (typeof options.doneCallback == 'function') options.doneCallback(error);
                });
        } catch (e) {
            console.log('Failed to delete file');
            if (typeof options.doneCallback == 'function') options.doneCallback(e);
        }
    }

    public solveBase64String(str: string): string {
        if (str) return str.replace(/data:image\/(jpeg|png);base64,/, '');
        return '';
    }
}