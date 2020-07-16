const _pageConfig = new pageConfig();

import { Component, OnInit } from '@angular/core';
import { BookModelService as _ModelService } from 'src/app/admin/shared/models/book-model.service';
import { BookValidate as _MainValidate } from 'src/app/admin/shared/validates/book.validate';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Upload } from 'src/app/shared/defines/upload';
import { HelperService } from 'src/app/shared/services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { pageConfig } from '../../defines/pageConfig';
import { Conf } from 'src/app/shared/defines/conf';
import { FormGeneral } from '../../../form.general';


declare var $: any;

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    providers: [],
})
export class FormComponent extends FormGeneral implements OnInit {

    public _controller: string;
    public _formType: string;
    public _selectedFiles: File;
    public _submittedForm: any;
    public _currentItem: any = {};
    public _uploadProgress: number;
    public _formProfile: FormGroup;

    constructor(
        public _conf: Conf,
        protected _modelService: _ModelService,
        protected _helperService: HelperService,
        protected _formBuilder: FormBuilder,
        protected _activatedRoute: ActivatedRoute,
    ) {
        super(_conf, _helperService, _formBuilder, _activatedRoute);
    }

    ngOnInit(): void {
        // assign controller
        this._controller = _pageConfig._controller;
        this._modelService.controller = this._controller;
        this.initForm();
    }

    // HAS THUMB
    protected initiateFormProfile(): void {
        let formData = {
            title: [this._helperService.getVal(this._currentItem, 'title.value') || ''],
            author: [this._helperService.getVal(this._currentItem, 'author.value') || ''],
            description: [this._helperService.getVal(this._currentItem, 'description.value') || ''],
            price: [this._currentItem.price || ''],
            category: [this._helperService.getVal(this._currentItem, 'category.name.value') || ''],
            status: [this._currentItem.status || ''],
            special: [this._currentItem.special || ''],
            saleOff: [this._currentItem.saleOff || ''],
            thumb: [''],
        }
        new _MainValidate().runValidate(this._currentItem, formData)
        this._formProfile = this._formBuilder.group(formData);
        //this._formProfile.valueChanges.subscribe(()=>{
            //console.log(this._formProfile.controls.title);
        //})
    }

    public onSubmitForm(): void {
        if (this._formProfile.dirty && this._formProfile.valid) {
            this._submittedForm = this._formProfile.value;

            let callbacks: any = {
                // upload in progress call back
                progressCallback: (upload: Upload) => {
                    this._uploadProgress = upload._progress;
                },

                doneCallback: (error) => {
                    let crudType = (this._formType == 'add') ? 'create' : 'update';
                    let resultStatus = (error) ? 'fail' : 'success';
                    this._helperService.notifier({
                        notifierData: {
                            type: this._conf.message.crud[`${crudType}_${resultStatus}`].type,
                            message: this._conf.message.crud[`${crudType}_${resultStatus}`].content,
                        }
                    }, 'show');
                }
            }

            // solve submit
            if (this._formType == 'edit') this.solveEditSubmitHasThumb(callbacks);
            else this.solveAddSubmitHasThumb(callbacks);

            // reset add form
            if (this._formType == 'add') this.resetForm();
        }
    }
}
