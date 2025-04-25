import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FaltasYPermisosComponent } from "./faltas-y-permisos.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'folder-digital-empleado'
        },
        children: [
            {
                path: '',
                component: FaltasYPermisosComponent,
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


