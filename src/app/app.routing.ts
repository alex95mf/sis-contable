import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router'; 
  

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { HomeComponent } from './view/home/home.component'
import { P404Component } from './view/error/404.component';
import { P500Component } from './view/error/500.component';
import { GuardSystem } from './services/guardSystem';
import { GuardLogin } from './services/guardLogin.service';
import { MaintenanceComponent } from './view/comercializacion/facturacion/maintenance/maintenance.component';
import { NewHomeComponent } from './view/new-home/new-home.component';

export const routes: Routes = [

    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '404',
      component: P404Component,
      data: {
        title: 'Page 404'
      }
    },
    {
      path: 'old-home',
      component: HomeComponent,
      canActivate: [GuardLogin],
      data: {
        title: 'Register Page'
      }
    },
    {
      path: 'home',
      component: NewHomeComponent,
      canActivate: [GuardLogin],
      data: {
        title: 'Register Page'
      }
    },
    {
      path: '500',
      component: P500Component,
      data: {
        title: 'Page 500'
      }
    },
    {
      path: '',
      component: DefaultLayoutComponent,
      canActivate: [GuardSystem],
      data: {
        title: 'Home'
      },
      children: [
        {
          path: 'dashboard',
          loadChildren: () => import('./view/dashboard/dashboard.module').then(m => m.DashboardModule)
        },
        {
          path: 'plantillas',
          loadChildren: () => import('./view/plantillas/plantillas.module').then(m => m.PlantillasModule)
        }, 
        {
          path: 'bancos',
          loadChildren: () => import('./view/caja-banco/caja-banco.module').then(m => m.CajaBancoModule)
        }, 
        {
          path: 'contabilidad',
          loadChildren: () => import('./view/contabilidad/contabilidad.module').then(m => m.ContabilidadModule)
        }, 
        {
          path: 'rrhh',
          loadChildren: () => import('./view/rrhh/rrhh.module').then(m => m.RrhhModule)
        }, 
        {
          path: 'proveeduria',
          loadChildren: () => import('./view/proveeduria/proveeduria.module').then(m => m.ProveeduriaModule)
        },
        {
          path: 'inventario',
          loadChildren: () => import('./view/inventario/inventario.module').then(m => m.InventarioModule)
        },
        {
          path: 'importacion',
          loadChildren: () => import('./view/importaciones/importaciones.module').then(m => m.ImportacionesModule)
        },
        {
          path: 'comercializacion',
          loadChildren: () => import('./view/comercializacion/comercializacion.module').then(m => m.ComercializacionModule)
        }, 
        {
          path: 'cartera',
          loadChildren: () => import('./view/cartera/cartera.module').then(m => m.CarteraModule)
        }, 
        {
          path: 'panel',
          loadChildren: () => import('./view/panel-control/panel-control.module').then(m => m.PanelControlModule)
        }, 
        {
          path: 'planificacion',
          loadChildren: () => import('./view/planificacion/planificacion.module').then(m => m.PlanificacionModule)
        },
        {
          path: 'rentas',
          loadChildren: () => import('./view/rentas/rentas.module').then(m => m.RentasModule)
        },
        {
          path: 'regpropiedad',
          loadChildren: () => import('./view/reg-propiedad/reg-propiedad.module').then(m => m.RegPropiedadModule)
        },
        {
          path: 'administracion',
          loadChildren: () => import('./view/administracion/administracion.module').then(m => m.AdministracionModule)
        },
        {
          path: 'tesoreria',
          loadChildren: () => import('./view/tesoreria/tesoreria.module').then(m => m.TesoreriaModule)
        },
        
        {
          path: 'cobros',
          loadChildren: () => import('./view/cobros/cobros.module').then(m => m.CobrosModule)
        },
        {
          path: 'compras-publicas',
          loadChildren: () => import('./view/compras-publicas/compras-publicas.module').then(m => m.ComprasPublicasModule)
        },
        {
          path: 'bienes',
          loadChildren: () => import('./view/gestion-bienes/gestion-bienes.module').then(m => m.GestionBienesModule)
        },
        {

          path: 'presupuesto',
          loadChildren: () => import('./view/presupuesto/presupuesto.module').then(m => m.PresupuestoModule)
        },
        {

          path: 'test',
          loadChildren: () => import('./view/test/test.module').then(m => m.TestModule)
        },
        {
          path: 'catastro',
          loadChildren: () => import('./view/catastro/catastro.module').then(m => m.CatastroModule),
        },
        {
          path: 'profile',
          loadChildren: () => import('./view/profile/profile.module').then(m => m.ProfileModule),
        },
        {
          path: 'digitalizacion',
          loadChildren: () => import('./view/digitalizacion/digitalizacion.module').then(m => m.DigitalizacionModule),
        },
        {
          path: 'crm',
          loadChildren: () => import('./view/crm/crm.module').then(m => m.CrmModule),
        },
      /* {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      }, 
      {
        path: 'sistemas',
        loadChildren: () => import('./views/sistemas/sistemas.module').then(m => m.SistemasModule)
      }, 
      {
        path: 'contabilidad',
        loadChildren: () => import('./views/contabilidad/contabilidad.module').then(m => m.ContabilidadModule)
      }, 
      {
        path: 'administracion',
        loadChildren: () => import('./views/administracion/administracion.module').then(m => m.AdministracionModule)
      }, 
      {
        path: 'inventario',
        loadChildren: () => import('./views/inventario/inventario.module').then(m => m.InventarioModule)
      },
      {
        path: 'venta',
        loadChildren: () => import('./views/venta/venta.module').then(m => m.VentaModule)
      },
      {
        path: 'compra',
        loadChildren: () => import('./views/compra/compra.module').then(m => m.CompraModule)
      },
      {
        path: 'bancos',
        loadChildren: () => import('./views/banco/banco.module').then(m => m.BancoModule)
      }, 
      {
        path: 'cartera',
        loadChildren: () => import('./views/cartera/cartera.module').then(m => m.CarteraModule)
      }, 
      {
        path: 'cxp',
        loadChildren: () => import('./views/pagos/pagos.module').then(m => m.PagosModule)
      }, 
      {
        path: 'proveeduria',
        loadChildren: () => import('./views/proveduria/proveduria.module').then(m => m.ProveduriaModule)
      }, 
      {
        path: 'importacion',
        loadChildren: () => import('./views/importacion/importacion.module').then(m => m.ImportacionModule)
      }, */
      {
        path: 'comercializacion/facturacion/maintenance/:maintenance',
        component: MaintenanceComponent,
      }
      ]
    },
    { path: '**', component: P404Component }
  ];
 

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
            relativeLinkResolution: 'legacy',
            // useHash: true
        })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }