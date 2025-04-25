import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreSuperavitComponent } from './cierre-superavit.component';

const routes: Routes = [
  {
    path: '',
    component: CierreSuperavitComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreSuperavitRoutingModule { }
