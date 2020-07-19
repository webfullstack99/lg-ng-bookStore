import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFormComponent } from '../widget/components/admin-form/admin-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminWidgetModule } from '../widget/admin-widget.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
    imports: [
        SharedModule,
        AdminWidgetModule,
        ReactiveFormsModule,
        FormsModule,
        CKEditorModule,
    ],
    declarations: [AdminFormComponent ],
    exports: [
        AdminFormComponent,
    ],
    providers: [],
})
export class AdminSharedModule { }
