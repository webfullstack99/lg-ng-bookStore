import { Validators } from '@angular/forms';
import { CustomValidators } from '../defines/custom-validators';
import { Conf } from 'src/app/shared/defines/conf';

export class BookValidate {

    private _controller: string = 'book';
    private _vldParams: any;

    constructor() {
        this._vldParams = new Conf().templateConf[this._controller].formParams;
    }

    public runValidate(item: any, formData: any): any {
        // thumb
        let thumbValidates: any[] = [];
        if (!item.thumb) thumbValidates.push(Validators.required);

        let validateData: any = {
            title: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.title.min, this._vldParams.title.max),
            ],
            author: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.author.min, this._vldParams.author.max),
            ],
            description: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.description.min, this._vldParams.description.max),
            ],
            slug: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.slug.min, this._vldParams.slug.max),
            ],
            price: [
                Validators.required,
                CustomValidators.between(this._vldParams.price.min, this._vldParams.price.max),
            ],
            //category: [Validators.required,],

            status: [
                Validators.required,
                CustomValidators.fieldSelectData('status'),
            ],
            special: [
                Validators.required,
                CustomValidators.fieldSelectData('special'),
            ],
            saleOff: [
                Validators.required,
                CustomValidators.between(this._vldParams.saleOff.min, this._vldParams.saleOff.max),
            ],
            thumb: thumbValidates,
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
