import { Validators } from '@angular/forms';

export class BookValidate {

    constructor() { }

    public runValidate(item: any, formData: any): any {
        // thumb
        let thumbValidates: any[] = [];
        if (!item.thumb) thumbValidates.push(Validators.required);

        let validateData: any = {
            title: [Validators.required,],
            author: [Validators.required,],
            description: [],
            price: [Validators.required,],
            //category: [Validators.required,],

            status: [Validators.required,],
            special: [Validators.required,],
            saleOff: [Validators.required,],
            thumb: thumbValidates,
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
