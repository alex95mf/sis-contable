import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapacitacionComponent } from './capacitacion.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'capacitacion'
    },
    children: [
        {
            path: '',
            component: CapacitacionComponent,
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
export class CapacitacionRoutingModule { }
