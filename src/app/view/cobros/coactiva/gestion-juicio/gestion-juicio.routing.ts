import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionJuicioComponent } from './gestion-juicio.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'gestion-juicio'
    },
    children: [
        {
            path: '',
            component: GestionJuicioComponent,
        },
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionJuicioRoutingModule { }
