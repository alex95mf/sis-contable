import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VencimientoComponent } from './vencimiento.component';

const routes: Routes = [
  { 
    path: '',
    component: VencimientoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VencimientoRoutingModule { }
