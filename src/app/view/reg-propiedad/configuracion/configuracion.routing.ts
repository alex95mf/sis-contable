import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'reg-propiedad/configuracion'
        },
        children: [
            {
                path: 'contribuyente',
                loadChildren: () => import('../../reg-propiedad/configuracion/contribuyente/contribuyente.module').then(m => m.ContribuyenteModule)
            },
            {
                path: 'aranceles',
                loadChildren: () => import('../../reg-propiedad/configuracion/aranceles/aranceles.module').then(m => m.ArancelesModule)
            },
            {
                path: 'excepciones',
                loadChildren: () => import('./exoneraciones/exoneraciones.module').then(m => m.ExoneracionesModule)
            },
            {
                path: 'tablacuantia',
                loadChildren: () => import('./tabla-cuantia/tabla-cuantia.module').then(m => m.TablaCuantiaModule)
            },
            {
                path: 'cat-esp-publicitarios',
                loadChildren: () => import('../../reg-propiedad/configuracion/categorias-esp-publicitarios/categorias-esp-publicitarios.module').then(m => m.CategoriasEspPublicitariosModule)
            }
            /*{
                path: 'excepciones',
                loadChildren: () => import('../../reg-propiedad/configuracion/excepciones/excepciones.module').then(m => m.ExcepcionesModule)
            }*/
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule {}