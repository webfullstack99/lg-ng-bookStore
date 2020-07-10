import { Component, OnInit, Input } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: 'app-filter-buttons',
    templateUrl: './filter-buttons.component.html',
    styleUrls: ['./filter-buttons.component.css']
})
export class FilterButtonsComponent implements OnInit {
    public _filters: string[];
    public _selectData: string[];
    @Input('controller') _controller: string

    constructor(
        public _conf: Conf,
        public _helperService: HelperService
    ) { }

    ngOnInit(): void {
        this._filters = this._helperService.getTemplateConf(this._controller).filter;
        this._selectData = this._helperService.getConf_selectData();
    }

    public getBtn(filter: string, btnType: string): any {
        let clientFilter = {
            status: 'active',
            display: 'no',
        }
        let template = this._helperService.getConf_btnTemplate()[filter][btnType];
        let btn = {
            classes: (btnType == clientFilter[filter]) ? 'btn btn-info' : 'btn btn-secondary',
            content: template.content,
        };
        return btn;
    }

}
