import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { AdminWidgetModule } from '../../widget/admin-widget.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '../../shared/admin-shared.module';
import { PageService } from './services/page.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFormComponent } from '../../widget/components/admin-form/admin-form.component';



@NgModule({
    declarations: [IndexComponent, FormComponent, AdminFormComponent],
    imports: [
        AdminWidgetModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule, 
    ],
    exports: [
        IndexComponent, FormComponent
    ],
    providers: [PageService]
})
export class ItemModule { }
