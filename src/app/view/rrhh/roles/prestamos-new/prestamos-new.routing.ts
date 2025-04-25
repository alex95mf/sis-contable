import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrestamosNewComponent } from './prestamos-new.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PrestamosNewComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamosNewRoutingModule { }
