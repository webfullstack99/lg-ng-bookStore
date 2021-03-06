import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Conf } from './defines/conf';
import { ShowTimeComponent } from './components/show-time/show-time.component';
import { UrlService } from './services/url.service';
import { HighlightService } from './services/highlight.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UcfirstPipe } from './pipes/ucfirst.pipe';
import { UploadService } from './services/upload.service';
import { HelperService } from './services/helper.service';
import { StrFormatService } from './services/str-format.service';
import { ItemModelService } from '../admin/shared/models/item-model.service';
import { AdminModelService } from '../admin/shared/models/admin-model.service';
import { Schema } from '../admin/shared/defines/schema';
import { HttpService } from '../admin/shared/services/http.service';

@NgModule({
    declarations: [NotFoundComponent, ShowTimeComponent, UcfirstPipe],
    imports: [
        HttpClientModule,
        RouterModule,
        BrowserModule,
        ReactiveFormsModule,
    ],
    exports: [
        NotFoundComponent,
        ShowTimeComponent,
        RouterModule,
        BrowserModule,
        UcfirstPipe,
    ],
    providers: [
        HttpService,
        Conf,
        UrlService,
        HighlightService,
        UploadService,
        HelperService,
        StrFormatService,

        // admin
        ItemModelService,
        AdminModelService,
        Schema
    ],

})
export class SharedModule { }
