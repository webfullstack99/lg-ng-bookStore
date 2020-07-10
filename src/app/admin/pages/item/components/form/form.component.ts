import { Component, OnInit } from '@angular/core';
import { ItemModelService as _ModelService } from 'src/app/admin/shared/services/item-model.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IItem } from 'src/app/shared/defines/item.interface';

declare var $: any;
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    providers: [],
})
export class FormComponent implements OnInit {

    public _controller: string;
    public _formType: string;
    public _selectedFile: File;
    public _submittedForm: any;
    public _currentItem: any = {};
    public _uploadProgress: number;
    public _formProfile: FormGroup;

    constructor(
        private _pageService: PageService,
        private _modelService: _ModelService,
        private _helperService: HelperService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        // assign controller
        this._controller = this._pageService._controller;
        this._modelService.controller = this._controller;

        // solve case
        let key = this._activatedRoute.snapshot.paramMap.get('key');
        console.log(key);
        if (key) {
            // edit
            this._formType = 'edit';
            this._modelService.getItem({ key }, {
                task: 'by-key', doneCallback: (data: IItem) => {
                    this._currentItem = data || {};
                    this.initiateFormProfile();
                }
            })
        } else {
            // add

            this._formType = 'add';
            this.initiateFormProfile();
        }
        // end solve case

    }

    private initiateFormProfile(): void {
        let thumbValidates = [];
        if (!this._currentItem.thumb) thumbValidates.push(Validators.required);
        this._formProfile = this._formBuilder.group({
            name: [this._currentItem.name, [
                Validators.required,
            ]],
            status: [this._currentItem.status, [
                Validators.required,
            ]],
            thumb: ['', thumbValidates],
        });
    }

    public onSelectedFile($event): void {
        this._selectedFile = $event.target.files[0];
        this._helperService.displayFileUploadName($event);
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            // solve submit
            if (this._formType == 'edit') {
                // edit
                if (this._selectedFile != null) {
                    this._submittedForm.thumb = this._selectedFile;
                    this._modelService.saveItem({
                        item: this._submittedForm,
                        key: this._currentItem.$key,
                        oldThumb: this._currentItem.thumb,
                    }, {
                        task: 'edit-change-thumb',
                        progressCallback: (upload: Upload) => {
                            this._uploadProgress = upload._progress;
                        },
                    });
                } else {
                    this._submittedForm.thumb = this._currentItem.thumb;
                    this._modelService.saveItem({ item: this._submittedForm, key: this._currentItem.$key }, {
                        task: 'edit-not-change-thumb',
                    });
                }

            } else {
                // add 
                this._submittedForm.thumb = this._selectedFile;
                this._modelService.saveItem({ item: this._submittedForm }, {
                    task: 'insert-one',
                    progressCallback: (upload: Upload) => {
                        this._uploadProgress = upload._progress;
                    },
                });

            }

            // reset form
            if (this._formType == 'add') this.resetForm();
        }
    }

    private resetForm(): void {
        this._formProfile.reset();
        $('#img-file-input').text('Choose file');
        this._selectedFile = null;
    }

    public isFormValid(): boolean {
        return this._formProfile.valid && this._formProfile.dirty;
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
