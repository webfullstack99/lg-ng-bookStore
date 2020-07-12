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



@NgModule({
    declarations: [NotFoundComponent, ShowTimeComponent],
    imports: [
        RouterModule,
        BrowserModule,
        ReactiveFormsModule,
    ],
    exports: [
        NotFoundComponent, 
        ShowTimeComponent, 
        ReactiveFormsModule, 
        RouterModule, 
        BrowserModule
    ],
    providers: [
        Conf, 
        UrlService, 
        HighlightService,
    ]

})
export class SharedModule { }
