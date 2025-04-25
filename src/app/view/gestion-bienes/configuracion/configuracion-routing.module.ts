import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoComponent } from './producto/producto.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'bienes/configuracion'
    },
    children: [
      {
        path: 'producto',
        loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule)
      },
      {
        path: 'catalogo-bienes',
        loadChildren: () => import('./catalogo-bienes/catalogo-bienes.module').then(m => m.CatalogoBienesModule)
      },
      {
        path: 'grupo-producto',
        loadChildren: () => import('./categoria-producto/categoria-producto.module').then(m => m.CategoriaProductoModule)
      },
      {
        path: 'bodega',
        loadChildren: () => import('./bodega/bodega-bienes.module').then(m=>m.BodegaModule)
      },
      {
        path: 'subgrupo-producto',
        loadChildren: () => import('./subgrupo-producto/subgrupo-producto.module').then(m=>m.SubgrupoProductoModule)
      },
      {
        path: 'lista-precios',
        loadChildren: () => import('./lista-precios/lista-precios.module').then(m=>m.ListaPreciosModule)
      }
      
     
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }
