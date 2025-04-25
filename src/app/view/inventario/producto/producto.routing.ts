import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'inventario/producto'
        },
        children: [
            {
                path: 'fichero',
                loadChildren: () => import('./ingreso/ingreso.module').then(m => m.IngresoProductoModule)
            },
            {
                path: 'lista',
                loadChildren: () => import('./lista/lista.module').then(m => m.ListaPrecioModule)
            },
            {
                path: 'producto',
                loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaProductoModule)
            },
            {
                path: 'oferta',
                loadChildren: () => import('./ofertas/ofertas.module').then(m => m.OfertasModule)
            },
            {
                path: 'cambioprecio',
                loadChildren: () => import('./precios/precios.module').then(m => m.PreciosModule)
            },
            {
                path: 'kardex',
                loadChildren: () => import('./kardex/kardex.module').then(m => m.KardexModule)
            },
            {
                path: 'tfisica',
                loadChildren: () => import('./toma-fisica/toma-fisica.module').then(m => m.TomaFisicaModule)
            },
            {
                path: 'searchProduct',
                loadChildren: () => import('./busqueda-producto/busqueda-producto.module').then(m => m.BusquedaProductoModule)
            },
            {
                path: 'minmax',
                loadChildren: () => import('./minmax/minmax.module').then(m => m.MinMaxModule)
            },
            {
                path: 'othergroup',
                loadChildren: () => import('./otrosgrupos/otrosgrupos.module').then(m => m.OtrosGruposModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoRoutingModule {}