import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IndexComponent as itemIndex } from './pages/item/components/index/index.component';
import { FormComponent as itemForm } from './pages/item/components/form/form.component';

const routes: Routes = [
    {
        path: 'admin',
        children: [
            {
                path: 'item',
                children: [
                    { path: 'form', component: itemForm, },
                    { path: '', component: itemIndex, },
                ]

            },
            { path: '', component: DashboardComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }