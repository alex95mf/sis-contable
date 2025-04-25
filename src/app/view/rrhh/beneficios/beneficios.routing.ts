import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'rrhh/beneficios'
        },
        children: [
            {
                path: 'decimot',
                loadChildren: () => import('./adm-decimo-tercero/adm-decimo-tercero.module').then(m => m.AdmDecimoTerceroModule)
            },
            {
                path: 'decimoc',
                loadChildren: () => import('./adm-decimo-cuarto/adm-decimo-cuarto.module').then(m => m.AdmDecimoCuartoModule)
            },
            {
                path: 'vacaciones',
                loadChildren: () => import('./vacaciones/vacaciones.module').then(m => m.VacacionesModule)
            },
            {
                path: 'utilidades',
                loadChildren: () => import('./utilidades/utilidades.module').then(m => m.UtilidadesModule)
            },
            {
                path: 'roles',
                loadChildren: () => import('./roles/benef-roles.module').then(m => m.RolesModule)
            },
            {
                path: 'rol-general',
                loadChildren: () => import('./rol-general/rol-general-empl.module').then(m => m.RolGeneralModule)
            },
            {
                path: 'gastos-personales',
                loadChildren: () => import('./gastos-personales/benef-gastos-personales.module').then(m => m.GastosPersonalesModule)
            },
            {
                path: 'consulta-rubros',
                loadChildren: () => import('./consulta-general-rubros/consulta-general-rubros.module').then(m => m.ConsultaGeneralRubrosModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiosRoutingModule {}