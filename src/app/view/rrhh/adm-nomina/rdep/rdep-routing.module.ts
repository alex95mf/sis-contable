import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdepComponent } from './rdep.component';

const routes: Routes =  [
  {
    path: '',
    data: {
        title: 'rdep'
    },
    children: [
        {
            path: '',
            component: RdepComponent,
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
export class RdepRoutingModule { }
