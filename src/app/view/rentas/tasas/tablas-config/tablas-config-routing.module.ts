import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablasConfigComponent } from './tablas-config.component'; 

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'tablas configuración'
    },
    children: [
        {
            path: '',
            component: TablasConfigComponent,
            data: {
                title: ''
            }
        },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablasConfigRoutingModule { }
