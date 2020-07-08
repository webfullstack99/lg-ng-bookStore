import { AngularFireStorage } from "@angular/fire/storage";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Conf } from './defines/conf';



@NgModule({
    declarations: [NotFoundComponent],
    imports: [
        CommonModule
    ],
    exports: [NotFoundComponent],
    providers: [Conf, AngularFireStorage]

})
export class SharedModule { }
