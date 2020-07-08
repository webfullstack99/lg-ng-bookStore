import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [],
})
export class FormComponent implements OnInit {

    public _selectedFile: File;
    public _submittedForm: object;
    public _formProfile: FormGroup;
    public _basePath: string = '/items'
    public _items: any[];
    public _downloadURL: string;

    constructor(
        private _db: AngularFireDatabase,
        private _uploadService: UploadService,
        private _formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this._formProfile = this._formBuilder.group({
            name: ['', [
                Validators.required,
            ]],
            status: ['', [
                Validators.required,
            ]],
            avatar: ['', [
                Validators.required,
            ]],
        });

        this._formProfile.valueChanges.subscribe((value) => {
        })

        this._db.list(this._basePath).valueChanges().subscribe((data) => {
            console.log(data);
        })
    }

    public onSelectedFile($event) {
        this._selectedFile = $event.target.files[0];
    }

    public onSubmitForm() {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            // solve submit
            this._uploadService.pushUpload(new Upload(this._selectedFile), this._basePath, (upload: Upload) => {
                let item = {
                    name: this._submittedForm['name'],
                    status: this._submittedForm['status'],
                    created: Date.now(),
                    url: upload._url,
                }
                this._db.list(this._basePath).push(item);
            })

            // reset form
            this._formProfile.reset();
            this._selectedFile = null;
        }
    }

    public isFormValid() {
        return this._formProfile.valid;
    }

    public testDb(): void {
        let run = false;
        if (run) {
            let basPath = 'test-db';
            this._db.list(basPath).remove();
            for (let i = 1; i <= 10; i++) {
                this._db.list(this._basePath).push({
                    name: `item ${i}`,
                })
            }
            this._db.list(basPath).valueChanges().subscribe((data) => {
                this._items = data;
            });
        }

    }


}
