import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: 'app-admin-table-input',
    templateUrl: './admin-table-input.component.html',
    styleUrls: ['./admin-table-input.component.css']
})
export class AdminTableInputComponent implements OnInit {

    @Input('controller') _controller: string;
    @Input('inputData') _inputData: any = {}
    @Output('onSelect') _onSelect = new EventEmitter<any>();

    constructor(
        public _helperService: HelperService,
    ) { }

    ngOnInit() {
    }

    public onSelect($event, item: any): void {
        this._onSelect.emit({ item, isChecked: $event.target.checked });
    }

    public onTheadCheckBoxCheck($event): void {
        this._onSelect.emit($event.target.checked);
    }
}
