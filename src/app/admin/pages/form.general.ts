import { Injectable, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Conf } from 'src/app/shared/defines/conf';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AdminModelService } from '../shared/models/admin-model.service';

@Injectable({
    providedIn: 'root'
})

export abstract class FormGeneral {

    public _controller: string;
    public _formType: string;
    public _submittedForm: any;
    public _currentItem: any = {};
    public _uploadProgress: number;
    public _formProfile: FormGroup;
    protected _modelService: AdminModelService;

    constructor(
        public _conf: Conf,
        protected _helperService: HelperService,
        protected _formBuilder: FormBuilder,
        protected _activatedRoute: ActivatedRoute,
    ) { }

    // ABSTRACT METHODS
    protected initiateFormProfile(): void { }


    protected initForm() {
        let key = this._activatedRoute.snapshot.paramMap.get('key');
        if (key) {
            // edit
            this._formType = 'edit';
            this._modelService.getItem({ key }, {
                task: 'by-key', doneCallback: (data: any) => {
                    this._currentItem = data || {};
                    this.initiateFormProfile();
                }
            })
        } else {
            // add
            this._formType = 'add';
            this.initiateFormProfile();
        }
    }

    protected getSavingDoneCallback(): Function {
        return (error) => {
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

    protected resetForm(): void {
        this._formProfile.reset();
        this._helperService.setDefaultTextForCustomFileInput();
    }

    // SOLVE SUBMIT
    // HAS THUMB
    protected solveEditSubmitHasThumb(callbacks: any): void {
        if (this._submittedForm.thumb) {
            // edit and change thumb
            this._modelService.saveItem({
                item: this._submittedForm,
                key: this._currentItem.$key,
                oldThumb: this._currentItem.thumb,
            }, {
                task: 'edit-change-thumb', ...callbacks
            });
        } else {
            // edit not change thumb
            this._submittedForm.thumb = this._currentItem.thumb;
            this._modelService.saveItem({ item: this._submittedForm, key: this._currentItem.$key }, {
                task: 'edit-not-change-thumb', ...callbacks
            });
        }
    }

    protected solveAddSubmitHasThumb(callbacks: any): void {
        // add 
        (this._submittedForm);
        this._modelService.saveItem({ item: this._submittedForm }, {
            task: 'insert-one', ...callbacks
        });
    }

    // NO THUMB
    protected solveEditSubmitNoThumb(callbacks: any): void { }
    protected solveAddSubmitNoThumb(callbacks: any): void { }
}