import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
    selector: '[app-thead-action-bar]',
    templateUrl: './thead-action-bar.component.html',
    styleUrls: ['./thead-action-bar.component.css']
})
export class TheadActionBarComponent implements OnInit {

    public _selectedAction: string;
    @Input('controller') _controller: string;
    @Input('totalItemsSelected') _totalItemSelected: number;

    @Output('submittedAction') _submittedAction = new EventEmitter<any>();
    @Output('onCancel') _onCancel = new EventEmitter<boolean>();

    constructor(
        public _helperService: HelperService,
    ) { }

    ngOnInit() {
    }

    public onCancel(): void {
        this._onCancel.emit(true);
    }

    public onSubmittedAction(data: any): void {
        this._submittedAction.emit(data);
    }

    public onActionChanges($event): void {
        this._selectedAction = $event.target.value;
    }

    public getActionOptions(): any {
        return this._helperService.getConf_selectData()[this._selectedAction];
    }

    public getOptionData(value): any {
        return this._helperService.getConf_btnTemplate()[this._selectedAction][value];
    }

    public onChooseOption(value): void {
        this.onSubmittedAction({ task: 'change', field: this._selectedAction, value });
    }
}
