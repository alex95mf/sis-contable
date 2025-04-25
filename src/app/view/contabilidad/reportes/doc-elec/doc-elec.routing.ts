import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocElecComponent } from './doc-elec.component';

const routes: Routes = [
  {
    path: '',
    component: DocElecComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocElecRoutingModule { }
