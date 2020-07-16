import { ValidatorFn, AbstractControl } from '@angular/forms';
import { HelperService } from 'src/app/shared/services/helper.service';
import { Conf } from 'src/app/shared/defines/conf';

const _conf = new Conf();

export class CustomValidators {
    constructor(
    ) { }

    public static lengthBetween(min: number, max: number): ValidatorFn {
        return (control: AbstractControl) => {
            if (control.value.length >= min && control.value.length <= max) return null;
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

    
    ///**
     //* Thumbs custom validators
     //* @param data - {ext}
     //* @returns thumb 
     //*/
    //public static thumb(data: any): ValidatorFn {
        //return (control: AbstractControl) => {
            //let file =
            //return {};
        //};
    //}
}
