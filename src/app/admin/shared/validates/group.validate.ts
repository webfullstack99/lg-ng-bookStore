import { Validators } from '@angular/forms';
import { Conf } from 'src/app/shared/defines/conf';
import { CustomValidators } from '../defines/custom-validators';

export class GroupValidate {

    private _controller: string = 'group';
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
            acp: [
                Validators.required,
                CustomValidators.fieldSelectData('acp'),
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
