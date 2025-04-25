import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'cobros/convenio'
    },
    children: [
        {
          path: 'arriendos-terreno',
          loadChildren: ()=> import('./convenio-arriente-t/convenio-arriente-t.module').then(m=>m.ConvenioArrienteTModule)
        },
        {
          path: 'consulta-convenio',
          loadChildren: ()=> import('./consulta-convenio/consulta-convenio.module').then(m=>m.ConsultaConvenioModule)
        },
        {
          path: 'reporte',
          loadChildren: ()=> import('./reporte/reporte.module').then(m=>m.ReporteModule)
        }
        
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvenioRoutingModule { }
