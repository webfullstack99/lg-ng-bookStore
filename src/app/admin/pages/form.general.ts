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

    private _editedFields: string[] = [];
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
        return (error, item: any) => {
            let crudType = (this._formType == 'add') ? 'create' : 'update';
            let resultStatus = (error) ? 'fail' : 'success';
            this._helperService.notifier({
                notifierData: {
                    type: this._conf.message.crud[`${crudType}_${resultStatus}`].type,
                    message: this._conf.message.crud[`${crudType}_${resultStatus}`].content,
                }
            }, 'show');
            if (!error && item) this._currentItem = { ... this._currentItem, ...item };
            this._editedFields = [];
        }
    }

    // SOLVE SUBMIT
    // HAS THUMB
    protected solveEditSubmitHasThumb(callbacks: any, item?: any): void {
        if (this._submittedForm.thumb) {
            this.setEditedFields();
            let saveItem: any = item || this._submittedForm;
            // edit and change thumb
            this._modelService.saveItem({
                item: saveItem,
                oldItem: this._currentItem,
                key: this._currentItem.$key,
                oldThumb: this._currentItem.thumb,
                editedFields: this._editedFields,
            }, {
                task: 'edit-change-thumb', ...callbacks
            });
        } else this.solveEditSubmitNoThumb(callbacks, item);
    }

    // NO THUMB
    protected solveEditSubmitNoThumb(callbacks: any, item?: any): void {
        this.setEditedFields();
        let saveItem: any = item || this._submittedForm;
        this._modelService.saveItem({
            item: saveItem,
            oldItem: this._currentItem,
            key: this._currentItem.$key,
            editedFields: this._editedFields,
        }, {
            task: 'edit-not-change-thumb', ...callbacks
        });
    }

    private setEditedFields(): void {
        for (let key in this._submittedForm) {
            let submittedVal: any = this._submittedForm[key];
            let itemVal: any = this._helperService.getVal(this._currentItem, this._helperService.getFieldPath(this._controller, key));
            if (submittedVal != itemVal) {
                if (key == 'thumb') {
                    if (this._submittedForm[key].trim() != '') this._editedFields.push(key);
                } else if (key != 'password_confirmed') this._editedFields.push(key);
            }
        }
    }

    protected solveAddSubmit(callbacks: any, item?: any): void {
        // add 
        let saveItem: any = item || this._submittedForm;
        this._modelService.saveItem({ item: saveItem }, {
            task: 'insert-one', ...callbacks
        });
    }

    /**
     * Updates relation field
     * @param params - { field, foreignField}
     * @param options - { doneCallback: () => void }
     */
    protected updateRelationFieldIfChanges(params: any, options: any): void {
        let $this: FormGeneral = this;
        let oldVal: string = this._helperService.getVal(this._currentItem, `${params.field}/${params.foreignField}`);
        let currentVal: string = this._submittedForm[params.field];
        if (oldVal != currentVal) {
            // update relation field
            this._modelService.getItemByFieldPathAndValue({
                controller: params.field,
                fieldPath: params.foreignField,
                value: this._submittedForm[params.field],
            }, {
                doneCallback: (item: any) => {
                    $this._submittedForm[params.field] = item;
                    if (this._helperService.isFn(options.doneCallback)) options.doneCallback(true);
                }
            })
        } else {
            // no change => assign old data for current data
            this._submittedForm[params.field] = this._currentItem[params.field];
            if (this._helperService.isFn(options.doneCallback)) options.doneCallback(false);
        }
    }
}