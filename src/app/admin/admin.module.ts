import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { ItemModule } from './pages/item/item.module';
import { UploadService } from '../shared/services/upload.service';

@NgModule({
    declarations: [AdminMainComponent, DashboardComponent],
    imports: [
        RouterModule,
        CommonModule,

        // pages
        ItemModule,
    ],
    exports: [AdminMainComponent],
    providers: [UploadService],

})
export class AdminModule { }
