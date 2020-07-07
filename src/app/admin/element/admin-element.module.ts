import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { TopbarSearchComponent } from './components/topbar-search/topbar-search.component';
import { TopbarRightComponent } from './components/topbar-right/topbar-right.component';
import { TopbarAlertComponent } from './components/topbar-alert/topbar-alert.component';
import { TopbarMessageComponent } from './components/topbar-message/topbar-message.component';
import { TopbarProfileComponent } from './components/topbar-profile/topbar-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
    declarations: [SidebarComponent, TopbarComponent, FooterComponent, TopbarSearchComponent, TopbarRightComponent, TopbarAlertComponent, TopbarMessageComponent, TopbarProfileComponent,],
    imports: [
        SharedModule,
        RouterModule,
        CommonModule
    ],
    exports: [
        SidebarComponent,
        TopbarComponent,
        FooterComponent,
    ]
})
export class AdminElementModule { }
