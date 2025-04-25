import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreBienesComponent } from './cierre-bienes.component';

const routes: Routes = [
  {
    path: '',
    component: CierreBienesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CierreBienesRoutingModule { }
