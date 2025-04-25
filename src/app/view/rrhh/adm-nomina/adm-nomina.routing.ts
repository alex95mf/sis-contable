import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        data: {
            title: 'rrhh/nomina'
        },
        children: [
            {
                path: 'cargafamiliar',
                loadChildren: () => import('./carga-familiar/carga-familiar.module').then(m => m.CargaFamiliarModule)
            },
            {
                path: 'fempleado',
                loadChildren: () => import('./empleado/empleado.module').then(m => m.EmpleadoModule)
            },
            {
                path: 'documento',
                loadChildren: () => import('./documentos/documentos.module').then(m => m.DocumentosModule)
            },
            {
                path: 'gempleado',
                loadChildren: () => import('./grupo/grupo.module').then(m => m.GrupoModule)
            },
            {
                path: 'reporte',
                loadChildren: () => import('./reporte/reporte.module').then(m => m.ReporteModule)
            },
            {
                path: 'asist_dias_trabajados',
                loadChildren: () => import('./asistencia-empleado/asistencia-empleado.module').then(m => m.AsistenciaEmpleadoModule)
            },
            {
                path: 'solicitudes',
                loadChildren: () => import('./prestamos-internos/prestamos-internos.module').then(m => m.PrestamosInternosModule)
            },
            {
                path: 'subrogacion',
                loadChildren: () => import('./subrogacion/subrogacion.module').then(m => m.SubrogacionModule)
            },
            {
                path: 'folder_digital_empleado',
                loadChildren: () => import('./folder-digital-empleado/rhfolder-digital-empleado.module').then(m => m.RhFolderDigitalEmpleadoModule)
            },
            {
                path: 'faltas-permisos',
                loadChildren: () => import('./faltas-permisos/faltas-permisos.module').then(m => m.FaltasYPermisosModule)
            },
            {
                path: 'rdep',
                loadChildren: () => import('./rdep/rdep.module').then(m => m.RdepModule)
            },
            {
                path: 'ingresos_y_descuentos_del_empleado',
                loadChildren: () => import('./ingresos-y-descuentos-empleado/ingresos-y-dsctos-empleados.module').then(m => m.RhIngresosDsctosEmpleadoModule)
            },
            {
                path: 'estado-cuenta',
                loadChildren: () => import('./estado-cuenta/estado-cuenta.module').then(m => m.EstadoCuentaModule)
            },
            {
                path: 'estadisticas',
                loadChildren: () => import('./estadisticas/estadisticas.module').then(m => m.EstadisticasModule)
            },
            {
                path: 'saldos',
                loadChildren: () => import('./saldos-empleado/saldos-empleado.module').then(m => m.SaldosEmpleadoModule)
            }
        ]
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdmNominaRoutingModule {}