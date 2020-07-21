import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { AdminWidgetModule } from '../../widget/admin-widget.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '../../shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
    declarations: [IndexComponent, FormComponent],
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        AdminWidgetModule,
        AdminSharedModule
    ],
    exports: [
        IndexComponent, FormComponent
    ],
    providers: []
})
export class CategoryModule { }
