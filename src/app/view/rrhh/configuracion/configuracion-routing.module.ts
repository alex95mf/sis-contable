import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'rrhh/configuracion'
    },
    children: [
        {
            path: 'area',
            loadChildren: () => import('./area/area.module').then(m => m.AreaModule)
        },
        {
          path: 'departamento',
          loadChildren: () => import('./departamento/departamento.module').then(m => m.DepartamentoModule)
        },
        {
          path: 'rubros',
          loadChildren: ()=>import('./rubros/rubros.module').then(m=>m.RubrosModule)
        },
        {
          path: 'cargo',
          loadChildren: ()=>import('./cargo/cargo.module').then(m=>m.CargoModule)
        },
         {
          path: 'tipos_contratos',
          loadChildren: ()=>import('./tipo-contratos/tipos-contratos.module').then(m=>m.TiposDeContratosModule)
        },
        {
          path: 'contrato-rubros',
          loadChildren: () => import('./contrato-rubros/contrato-rubros.module').then(m => m.ContratoRubrosModule),
        },
        {
          path: 'jornada',
          loadChildren: () => import('./jornada/jornada.module').then(m => m.JornadaModule)
        },
        {
          path: 'programa',
          loadChildren: ()=> import('./progama/progama.module').then(m=>m.ProgamaModule)
        },
        {
          path: 'sueldos',
          loadChildren: ()=> import('./sueldos/sueldos.module').then(m=>m.SueldosModule)
        } , {
          path: 'grado-ocupacional',
          loadChildren: ()=> import('./grado-ocupacional/grado-ocupacional.module').then(m=>m.GradoOcupacionalModule)
        } ,
        {
          path: 'catalogo',
          loadChildren: () => import('./catalogo/catalogo.module').then(m => m.CatalogoModule)
        },{
          path: 'configuracion-contable',
          loadChildren: () => import('./configuracion-contable/configuracion-contable.module').then(m => m.ConfiguracionContableModule),
        },
        {
          path: 'parametros-nomina',
          loadChildren: () => import('./parametros-nomina/parametros-nomina.module').then(m => m.ParametrosNominaModule),
        },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
