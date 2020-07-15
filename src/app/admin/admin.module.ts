import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ItemModule } from './pages/item/item.module';
import { UploadService } from '../shared/services/upload.service';
import { SharedModule } from '../shared/shared.module';
import { BookModule } from './pages/book/book.module';
import { AdminWidgetModule } from './widget/admin-widget.module';
import { AdminElementModule } from './element/admin-element.module';

@NgModule({
    declarations: [AdminMainComponent, DashboardComponent],
    imports: [
        // pages
        ItemModule,
        BookModule,
        SharedModule,
    ],
    exports: [AdminMainComponent],
    providers: [],

})
export class AdminModule { }
