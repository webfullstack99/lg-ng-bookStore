import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';

declare var $: any;
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [],
})
export class FormComponent implements OnInit {

    public _controller: string;
    public _selectedFile: File;
    public _submittedForm: any;
    public _uploadProgress: number;
    public _formProfile: FormGroup;

    constructor(
        private _pageService: PageService,
        private _modelService: _ModelService,
        private _helperService: HelperService,
        private _formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        // assign controller
        this._controller = this._pageService._controller;
        this._modelService.controller = this._controller;

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
            thumb: ['', [
                Validators.required,
            ]],
        });

    }

    public onSelectedFile($event): void {
        this._selectedFile = $event.target.files[0];
        this._helperService.displayFileUploadName($event);
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            // Assign thumb
            this._submittedForm.thumb = this._selectedFile;


            // solve submit
            this._modelService.saveItem({ item: this._submittedForm }, {
                task: 'insert-one',
                progressCallback: (upload: Upload) => {
                    this._uploadProgress = upload._progress;
                },
            });

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
    //this._db.list(this._controller).push({
    //name: `item ${i}`,
    //})
    //}
    //this._db.list(basPath).valueChanges().subscribe((data) => {
    //this._items = data;
    //});
    //}

    //}


}
