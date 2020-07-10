import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchComponent } from './components/search/search.component';
import { FilterButtonsComponent } from './components/filter-buttons/filter-buttons.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { XTitleComponent } from './components/x-title/x-title.component';
import { RouterModule } from '@angular/router';
import { MainTableComponent } from './components/main-table/main-table.component';
import { TableEmtpyMessageComponent } from './components/table-emtpy-message/table-emtpy-message.component';
import { ActionButtonsComponent } from './components/action-buttons/action-buttons.component';



@NgModule({
    declarations: [LogoutModalComponent, PaginationComponent, FilterComponent, SearchComponent, FilterButtonsComponent, MainTableComponent, PageTitleComponent, XTitleComponent, TableEmtpyMessageComponent, ActionButtonsComponent,],
    imports: [
        RouterModule,
        CommonModule
    ],
    exports: [
        LogoutModalComponent,
        SearchComponent,
        PaginationComponent,
        FilterComponent,
        MainTableComponent,
        PageTitleComponent,
        XTitleComponent,
        TableEmtpyMessageComponent,
        ActionButtonsComponent
    ]
})
export class AdminWidgetModule { }
