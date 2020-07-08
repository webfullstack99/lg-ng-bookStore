import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FilterComponent } from './components/filter/filter.component';
import { SearchComponent } from './components/search/search.component';
import { FilterButtonsComponent } from './components/filter-buttons/filter-buttons.component';



@NgModule({
    declarations: [LogoutModalComponent, PaginationComponent, FilterComponent, SearchComponent, FilterButtonsComponent],
    imports: [
        CommonModule
    ],
    exports: [
        LogoutModalComponent,
        SearchComponent,
        PaginationComponent,
        FilterComponent,
    ]
})
export class AdminWidgetModule { }
