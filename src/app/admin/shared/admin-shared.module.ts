import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFormComponent } from '../widget/components/admin-form/admin-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminWidgetModule } from '../widget/admin-widget.module';
import { CkEditorComponent } from '../widget/components/admin-form/ck-editor/ck-editor.component';


@NgModule({
    imports: [
        SharedModule,
        AdminWidgetModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [AdminFormComponent, CkEditorComponent],
    exports: [
        AdminFormComponent,
        CkEditorComponent
    ],
    providers: [],
})
export class AdminSharedModule { }
