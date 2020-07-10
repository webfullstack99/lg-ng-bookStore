import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: '[appActionButtons]',
    templateUrl: './action-buttons.component.html',
    styleUrls: ['./action-buttons.component.css']
})
export class ActionButtonsComponent implements OnInit {

    public _temp = 'onEditClick';
    public _controller: string;
    public _actions: string[];
    public _template: any;

    @Input('item') _item: any;
    @Input('appActionButtons') set setController(controller: string) {
        this._controller = controller;
        this._actions = this._conf.templateConf[this._controller].action;
        this._template = this._conf.template.format.button.action;
    }

    @Output('btnClick') _btnCLick = new EventEmitter<any>();

    constructor(
        public _conf: Conf,
    ) { }

    ngOnInit(): void {
    }

    public onBtnClick(action: string): void{
        this._btnCLick.emit({action, item: this._item});
    }

    public getBtnClass(action: string): string {
        return this._template[action].classes;
    }

    public getIconClass(action: string): string {
        return this._template[action].icon;
    }
}
