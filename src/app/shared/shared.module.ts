import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Conf } from './defines/conf.class';



@NgModule({
    declarations: [NotFoundComponent],
    imports: [
        CommonModule
    ],
    exports: [NotFoundComponent],
    providers: [Conf]

})
export class SharedModule { }
