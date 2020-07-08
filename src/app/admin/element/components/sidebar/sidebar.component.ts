import { Component, OnInit } from '@angular/core';
import { Conf } from 'src/app/shared/defines/conf';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    constructor(
        public _conf: Conf
    ) { }

    ngOnInit(): void {
    }

}
