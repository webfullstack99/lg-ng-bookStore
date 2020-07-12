import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { FormComponent } from './components/form/form.component';
import { AdminWidgetModule } from '../../widget/admin-widget.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminSharedModule } from '../../shared/admin-shared.module';
import { PageService } from './services/page.service';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
    declarations: [IndexComponent, FormComponent],
    imports: [
        AdminWidgetModule,
        FormsModule,
        SharedModule,
    ],
    exports: [
        IndexComponent, FormComponent
    ],
    providers: [PageService]
})
export class ItemModule { }
