import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AdminModule } from './admin/admin.module';
import { AdminRoutingModule } from './admin/admin-routing.module';
import { AdminElementModule } from './admin/element/admin-element.module';
import { AdminWidgetModule } from './admin/widget/admin-widget.module';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        SharedModule,

        // firebase 
        AngularFireModule.initializeApp(environment.firebase, 'book-store'),
        AngularFireDatabaseModule,

        // Feature modules
        AdminModule,
        AdminElementModule,
        AdminWidgetModule,

        // routing
        AdminRoutingModule,
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
