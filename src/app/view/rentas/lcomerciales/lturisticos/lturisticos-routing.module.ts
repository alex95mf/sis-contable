import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LturisticosComponent } from './lturisticos.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'locales-turisticos'
    },
    children: [
        {
            path: '',
            component: LturisticosComponent,
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
export class LturisticosRoutingModule { }
