import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { AdminWidgetModule } from '../../widget/admin-widget.module';



@NgModule({
    declarations: [IndexComponent, FormComponent],
    imports: [
        AdminWidgetModule,
        CommonModule
    ],
    exports: [
        IndexComponent, FormComponent
    ]
})
export class ItemModule { }
