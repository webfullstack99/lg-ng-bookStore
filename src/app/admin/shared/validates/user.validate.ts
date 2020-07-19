import { Validators } from '@angular/forms';
import { CustomValidators } from '../defines/custom-validators';
import { Conf } from 'src/app/shared/defines/conf';

export class UserValidate {

    private _controller: string = 'user';
    private _vldParams: any;

    constructor() {
        this._vldParams = new Conf().templateConf[this._controller].formParams;
    }

    public runValidate(item: any, formData: any): any {
        // thumb
        let thumbValidates: any[] = [];
        if (!item.thumb) thumbValidates.push(Validators.required);

        let validateData: any = {
            username: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.username.min, this._vldParams.username.max),
            ],
            email: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.email.min, this._vldParams.email.max),
            ],
            fullName: [
                Validators.required,
                CustomValidators.lengthBetween(this._vldParams.fullName.min, this._vldParams.fullName.max),
            ],
            password: [
                Validators.required,
            ],
            password_confirmed: [
                Validators.required,
            ],
            //group: [Validators.required,],

            status: [
                Validators.required,
                CustomValidators.fieldSelectData('status'),
            ],
            thumb: thumbValidates,
        };

        this.applyValidate(formData, validateData);
    }

    private applyValidate(formData, validateData): void {
        for (let key in formData) if (validateData[key]) formData[key].push(validateData[key]);
    }
}
