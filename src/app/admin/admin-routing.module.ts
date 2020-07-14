import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IndexComponent as itemIndex } from './pages/item/components/index/index.component';
import { FormComponent as itemForm } from './pages/item/components/form/form.component';
import { Conf } from '../shared/defines/conf';
import { TestDbComponent } from './widget/components/test-db/test-db.component';
import { HelperService } from '../shared/services/helper.service';

const _conf = new Conf;
const routes: Routes = [
    {
        path: _conf.noSlashes(_conf.prefix.admin),
        children: [
            {
                path: 'item',
                children: [
                    { path: 'form', component: itemForm, },
                    { path: 'form/:key', component: itemForm, },
                    { path: '', component: itemIndex, },
                ]

            },
            { path: 'test-database', component: TestDbComponent },
            { path: '', component: DashboardComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }