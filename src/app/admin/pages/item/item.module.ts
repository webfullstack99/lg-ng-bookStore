import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { AdminWidgetModule } from '../../widget/admin-widget.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminSharedModule } from '../../shared/admin-shared.module';
import { PageService } from './services/page.service';



@NgModule({
    declarations: [IndexComponent, FormComponent],
    imports: [
        AdminSharedModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AdminWidgetModule,
        CommonModule
    ],
    exports: [
        IndexComponent, FormComponent
    ],
    providers: [PageService]
})
export class ItemModule { }
