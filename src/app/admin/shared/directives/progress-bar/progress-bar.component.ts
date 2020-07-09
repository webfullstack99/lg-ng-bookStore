import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: '[appProgressBar]',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
    public _progress: number;

    @Input('title') _title: string;

    @Input() set appProgressBar(progress: number) {
        this._progress = progress;
    }

    constructor() { }

    ngOnInit(): void {
    }

}
