import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { ItemComponent } from './components/item/item.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [AdminMainComponent, ItemComponent, DashboardComponent],
    imports: [
        RouterModule,
        CommonModule,
    ],
    exports: [AdminMainComponent]

})
export class AdminModule { }
