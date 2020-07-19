import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IndexComponent as itemIndex } from './pages/item/components/index/index.component';
import { FormComponent as itemForm } from './pages/item/components/form/form.component';
import { IndexComponent as bookIndex } from './pages/book/components/index/index.component';
import { FormComponent as bookForm } from './pages/book/components/form/form.component';
import { IndexComponent as userIndex } from './pages/user/components/index/index.component';
import { FormComponent as userForm } from './pages/user/components/form/form.component';
import { Conf } from '../shared/defines/conf';
import { TestDbComponent } from './widget/components/test-db/test-db.component';
import { HelperService } from '../shared/services/helper.service';
import { RawDataComponent } from './widget/components/raw-data/raw-data.component';

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

            }, {
                path: 'book',
                children: [
                    { path: 'form', component: bookForm, },
                    { path: 'form/:key', component: bookForm, },
                    { path: '', component: bookIndex, },
                ]

            }, {
                path: 'user',
                children: [
                    { path: 'form', component: userForm, },
                    { path: 'form/:key', component: userForm, },
                    { path: '', component: userIndex, },
                ]

            },
            { path: 'test-database', component: TestDbComponent },
            { path: 'raw-data', component: RawDataComponent },
            { path: '', component: DashboardComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }