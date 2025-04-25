import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreCxcComponent } from './cierre-cxc.component';

const routes: Routes = [
  {
    path: '',
    component: CierreCxcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreCxcRoutingModule { }
