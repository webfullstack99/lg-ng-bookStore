import { ImageCropperModule } from 'ngx-image-cropper';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminFormComponent } from '../widget/components/admin-form/admin-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminWidgetModule } from '../widget/admin-widget.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageCropperFileInputComponent } from '../widget/components/image-cropper-file-input/image-cropper-file-input.component';


@NgModule({
    imports: [
        ImageCropperModule,
        SharedModule,
        AdminWidgetModule,
        ReactiveFormsModule,
        FormsModule,
        CKEditorModule,
    ],
    declarations: [AdminFormComponent, ImageCropperFileInputComponent ],
    exports: [
        ImageCropperFileInputComponent,
        AdminFormComponent,
    ],
    providers: [],
})
export class AdminSharedModule { }
