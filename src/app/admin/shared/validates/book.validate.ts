import { Validators } from '@angular/forms';
import { CustomValidators } from '../defines/custom-validators';

export class BookValidate {

    constructor() { }

    public runValidate(item: any, formData: any): any {
        // thumb
        let thumbValidates: any[] = [];
        if (!item.thumb) thumbValidates.push(Validators.required);

        let validateData: any = {
            title: [
                Validators.required,
                CustomValidators.lengthBetween(10, 200),
            ],
            author: [
                Validators.required,
                CustomValidators.lengthBetween(5, 50),
            ],
            description: [
                Validators.required,
                CustomValidators.lengthBetween(10, 5000),
            ],
            price: [
                Validators.required,
                CustomValidators.between(5000, 1000000),
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
                CustomValidators.between(1, 100),
            ],
            thumb: thumbValidates,
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
