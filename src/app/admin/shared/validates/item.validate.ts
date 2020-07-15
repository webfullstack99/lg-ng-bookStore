import { Validators } from '@angular/forms';

export class ItemValidate {

    constructor() { }

    public runValidate(item: any, formData: any): any {
        // thumb
        let thumbValidates: any[] = [];
        if (!item.thumb) thumbValidates.push(Validators.required);

        let validateData: any = {
            name: [Validators.required,],
            status: [Validators.required,],
            thumb: thumbValidates,
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
