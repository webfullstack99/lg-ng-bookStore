import { AngularFireStorage } from "@angular/fire/storage";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Conf } from './defines/conf';
import { ShowTimeComponent } from './components/show-time/show-time.component';
import { UrlService } from './services/url.service';
import { HighlightService } from './services/highlight.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UcfirstPipe } from './pipes/ucfirst.pipe';



@NgModule({
    declarations: [NotFoundComponent, ShowTimeComponent, UcfirstPipe],
    imports: [
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
        Conf,
        UrlService,
        HighlightService,
    ]

})
export class SharedModule { }
