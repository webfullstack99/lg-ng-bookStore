import { NgModule } from '@angular/core';
import { AdminModelService } from './services/admin-model.service';
import { ItemModelService } from './services/item-model.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [],
    imports: [
        SharedModule,
    ],
    exports: [],
    providers: [ItemModelService, AdminModelService],
})
export class AdminSharedModule { }
