import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';
import { AdminModelService } from 'src/app/admin/shared/models/admin-model.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-field-select',
    templateUrl: './field-select.component.html',
    styleUrls: ['./field-select.component.css']
})
export class FieldSelectComponent implements OnInit {

    public _selectData: any[];

    @Input('field') _field: string;
    @Input('value') _value: any;
    @Input('min-width') _minWidth: string = '100px';
    @Input('controller') _controller: any;
    @Input('dbSelectDataBehavior') _dbSelectDataBehavior: BehaviorSubject<any[]>;

    @Output('onChange') _onChange = new EventEmitter<string>();

    constructor(
        public _helperService: HelperService,
        public _adminModel: AdminModelService,
    ) { }

    ngOnInit() {
        if (!this._dbSelectDataBehavior) this._selectData = this._helperService.getConf_selectData()[this._field];
        else {
            this._dbSelectDataBehavior.subscribe((data: any[]) => {
                let temp: any = this._helperService.getItemInArrayByProperty(data, 'field', this._field);
                if (temp) this._selectData = temp.data;
            })
        }
    }

    public onChange(value: string): void {
        this._onChange.emit(value);
    }

    public isSelected(value: string): boolean {
        return (value == this._value) ? true : false;
    }
}
