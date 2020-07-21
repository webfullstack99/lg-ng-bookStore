import { Validators } from '@angular/forms';
import { Conf } from 'src/app/shared/defines/conf';
import { CustomValidators } from '../defines/custom-validators';

export class CategoryValidate {

    private _controller: string = 'category';
    private _vldParams: any;

    constructor() {
        this._vldParams = new Conf().templateConf[this._controller].formParams;
    }

    public runValidate(item: any, formData: any): any {
        let validateData: any = {
            name: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.name.min, this._vldParams.name.max),
            ],
            slug: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.slug.min, this._vldParams.slug.max),
            ],
            status: [
                Validators.required,
                CustomValidators.fieldSelectData('status'),
            ],
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
