import { AngularFireStorage } from "@angular/fire/storage";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Conf } from './defines/conf';
import { ShowTimeComponent } from './components/show-time/show-time.component';
import { UrlService } from './services/url.service';



@NgModule({
    declarations: [NotFoundComponent, ShowTimeComponent],
    imports: [
        CommonModule
    ],
    exports: [NotFoundComponent, ShowTimeComponent],
    providers: [Conf, AngularFireStorage, UrlService]

})
export class SharedModule { }
