import { NgModule } from '@angular/core';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ItemModule } from './pages/item/item.module';
import { SharedModule } from '../shared/shared.module';
import { BookModule } from './pages/book/book.module';
import { UserModule } from './pages/user/user.module';
import { CategoryModule } from './pages/category/category.module';
import { GroupModule } from './pages/group/group.module';

@NgModule({
    declarations: [AdminMainComponent, DashboardComponent],
    imports: [
        // pages
        ItemModule,
        BookModule,
        CategoryModule,
        UserModule,
        GroupModule,
        SharedModule,
    ],
    exports: [AdminMainComponent],
    providers: [],

})
export class AdminModule { }
