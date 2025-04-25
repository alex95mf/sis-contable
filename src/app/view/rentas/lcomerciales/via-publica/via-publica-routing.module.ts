import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViaPublicaComponent } from './via-publica.component';

const routes: Routes = [  

  {
    path: '',
    data: {
        title: 'via-publica'
    },
    children: [
        {
            path: '',
            component: ViaPublicaComponent,
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
export class ViaPublicaRoutingModule { }
