import { ValidatorFn, AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';

declare const $: any;
const _conf = new Conf();

export class CustomValidators {
    constructor(
    ) { }

    public static matchPassword(pwd: string, pwdConfirmed: string): ValidatorFn {
        return (group: FormGroup) => {
            let pwdVal: string = group.controls[pwd].value || '';
            if (pwdVal.trim() != '') {
                let pwdConfirmedVal: string = group.controls[pwdConfirmed].value;
                if (pwdVal != pwdConfirmedVal)
                    return { matchPassword: true };
            }
            return null;
        };
    }

    public static lengthBetween(min: number, max: number): ValidatorFn {
        return (control: AbstractControl) => {
            let value = (control.value == null) ? '' : control.value;
            value = this.getTextFormString(value);
            if (value.length >= min && value.length <= max) return null;
            return {
                lengthBetween: { min, max }
            }
        };
    }

    public static between(min: number, max: number): ValidatorFn {
        return (control: AbstractControl) => {
            if (control.value >= min && control.value <= max) return null;
            return {
                between: { min, max }
            }
        };
    }

    public static fieldSelectData(field: string): ValidatorFn {
        return (control: AbstractControl) => {
            let selectData: string[] = _conf.template.selectData[field];
            if (selectData.includes(control.value)) return null;
            return {
                fieldSelectData: true,
            }
        };
    }

    public static getTextFormString(str: string): string {
        if (str.match(/^\<[\w]+\>/)) return $(str).text();
        return str;
    }

    // password
    static password(minLength: number = 8): ValidatorFn {
        return (control: AbstractControl) => {
            let value = control.value || '';
            if (value.trim() != '') {
                let errCount: number = 0;
                let result: any = {};
                let paterns: any[] = [
                    { name: 'digit', pattern: /(?=.*\d)/, },
                    { name: 'uppercase', pattern: /(?=.*[A-Z])/, },
                    { name: 'special', pattern: /(?=.*\W)/, },
                ]

                // validate
                for (let item of paterns) {
                    if (!value.match(item.pattern)) {
                        result[item.name] = true;
                        errCount++;
                    } else result[item.name] = false;
                }

                // space
                if (this.noSpace(control)) {
                    result.space = true;
                    errCount++;
                } else result.space = false;

                // length
                result.length = this.checkPasswordLength(value, minLength);
                if (result.length) errCount++;

                // return
                if (errCount > 0) return { password: result };
            }
            return null;
        }
    }

    static lowercase(control: AbstractControl): ValidationErrors | null {
        let value = control.value || '';
        let pattern: any = /[A-Z]/g;
        if (value.match(pattern)) return { lowercase: true }
        return null;
    }

    static email(control: AbstractControl): ValidationErrors | null {
        let value = control.value || '';
        let pattern: any = /^[A-Za-z0-9\_]{8,16}\@[a-z]{2,6}(\.[a-z]{2,6}){1,5}$/;
        if (!value.match(pattern)) return { email: true }
        return null;
    }

    static checkPasswordLength(value, minLength): any {
        if (value.length >= minLength) return false;
        else return {
            actualLength: value.length,
            minLength
        }
    }

    static noSpace(control: AbstractControl): ValidationErrors | null {
        let value = control.value || '';
        if (value.match(/\s/g)) return { noSpace: true }
        return null;
    }

    static noSpecialSymbol(control: AbstractControl): ValidationErrors | null {
        let value = control.value || '';
        if (value.match(/\W/g)) return { noSpecialSymbol: true }
        return null;
    }
}
