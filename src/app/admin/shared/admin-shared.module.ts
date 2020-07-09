import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './directives/progress-bar/progress-bar.component';
import { AdminModelService } from './services/admin-model.service';
import { ItemModelService } from './services/item-model.service';


@NgModule({
    declarations: [ProgressBarComponent],
    imports: [
        CommonModule
    ],
    exports: [ProgressBarComponent],
    providers: [ItemModelService, AdminModelService],
})
export class AdminSharedModule { }
