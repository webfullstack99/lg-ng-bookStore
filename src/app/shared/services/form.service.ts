import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor(
        private _helperService: HelperService
    ) { }

    

    /**
     * Checkboxs form service
     * @param data {name, displayName, value}
     * @returns checkbox 
     */
    public checkbox(data: any): any {
        return this._helperService.toHtml(`
        <div class="form-check form-check-inline d-flex justify-content-between"> 
            <label class="form-check-label" for="${data.name}">${data.displayName}</label>
            <input class="form-check-input" type="checkbox" id="${data.name}" value="${data.value}">
        </div>`);
    }
}
