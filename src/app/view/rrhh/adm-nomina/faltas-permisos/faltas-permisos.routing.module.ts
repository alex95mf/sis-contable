import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FaltasPermisosComponent } from "./faltas-permisos.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'folder-digital-empleado'
        },
        children: [
            {
                path: '',
                component: FaltasPermisosComponent,
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
export class FaltasYPermisosRoutingModule{}


