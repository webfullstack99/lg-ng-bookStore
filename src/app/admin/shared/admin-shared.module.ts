import { NgModule } from '@angular/core';
import { AdminModelService } from './services/admin-model.service';
import { ItemModelService } from './services/item-model.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Schema } from './defines/schema';


@NgModule({
    declarations: [],
    imports: [
        SharedModule,
    ],
    exports: [],
    providers: [ItemModelService, AdminModelService, Schema],
})
export class AdminSharedModule { }
