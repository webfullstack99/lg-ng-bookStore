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
import { ShowAndPushDataComponent } from './components/show-and-push-data/show-and-push-data.component';
import { TheadAdminMainTableComponent } from './components/thead-admin-main-table/thead-admin-main-table.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminTableInputComponent } from './components/admin-table-input/admin-table-input.component';
import { TheadActionBarComponent } from './components/thead-action-bar/thead-action-bar.component';
import { TestDbComponent } from './components/test-db/test-db.component';
import { FieldButtonComponent } from './components/field-button/field-button.component';
import { FieldSelectComponent } from './components/field-select/field-select.component';
import { FieldInputComponent } from './components/fieldInput/fieldInput.component';
import { ShowErrorMessageComponent } from './components/show-error-message/show-error-message.component';
import { RawDataComponent } from './components/raw-data/raw-data.component';
import { ModalComponent } from './components/modal/modal.component';
import { FilterSelectsComponent } from './components/filter-selects/filter-selects.component';



@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        ModalComponent,
        LogoutModalComponent,
        PaginationComponent,
        FilterComponent,
        SearchComponent,
        FilterButtonsComponent,
        MainTableComponent,
        PageTitleComponent,
        XTitleComponent,
        TableEmtpyMessageComponent,
        ActionButtonsComponent,
        ShowAndPushDataComponent,
        TheadAdminMainTableComponent,
        ProgressBarComponent,
        AdminTableInputComponent,
        TheadActionBarComponent,
        TestDbComponent,
        RawDataComponent,
        FieldButtonComponent,
        FieldSelectComponent,
        FieldInputComponent,
        ShowErrorMessageComponent,
        FilterSelectsComponent,
    ],
    exports: [
        ModalComponent,
        RawDataComponent,
        LogoutModalComponent,
        SearchComponent,
        PaginationComponent,
        FilterComponent,
        MainTableComponent,
        PageTitleComponent,
        XTitleComponent,
        TableEmtpyMessageComponent,
        ActionButtonsComponent,
        ShowAndPushDataComponent,
        TheadAdminMainTableComponent,
        ProgressBarComponent,
        AdminTableInputComponent,
        TheadActionBarComponent,
        TestDbComponent,
        FieldButtonComponent,
        FieldSelectComponent,
        FieldInputComponent,
        ShowErrorMessageComponent,
        FilterSelectsComponent,
    ],
})
export class AdminWidgetModule { }
