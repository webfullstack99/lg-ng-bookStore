import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Upload } from 'src/app/shared/defines/upload';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [],
})
export class FormComponent implements OnInit {

    public _basePath: string = '/items'
    public _selectedFile: File;
    public _submittedForm: object;
    public _uploadProgress: number;
    public _formProfile: FormGroup;

    constructor(
        private _db: AngularFireDatabase,
        private _uploadService: UploadService,
        private _formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.initiateFormProfile();
    }

    private initiateFormProfile(): void {
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

    }

    public onSelectedFile($event): void {
        this._selectedFile = $event.target.files[0];
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            // solve submit
            this._uploadService.upload(new Upload(this._selectedFile), this._basePath, (upload: Upload) => {
                let item = {
                    name: this._submittedForm['name'],
                    status: this._submittedForm['status'],
                    created: Date.now(),
                    url: upload._url,
                }
                this._db.list(this._basePath).push(item);
            }, (upload: Upload) => {
                this._uploadProgress = upload._progress;
            })

            // reset form
            this.resetForm();
        }
    }

    private resetForm(): void {
        this._formProfile.reset();
        $('#img-file-input').text('Choose file');
        this._selectedFile = null;
    }

    public isFormValid(): boolean {
        return this._formProfile.valid;
    }

    //public testDb(): void {
    //let run = false;
    //if (run) {
    //let basPath = 'test-db';
    //this._db.list(basPath).remove();
    //for (let i = 1; i <= 10; i++) {
    //this._db.list(this._basePath).push({
    //name: `item ${i}`,
    //})
    //}
    //this._db.list(basPath).valueChanges().subscribe((data) => {
    //this._items = data;
    //});
    //}

    //}


}
