import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FolderDigitalEmpleadoComponent } from "./folder-digital-empleado.component";

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'folder-digital-empleado'
        },
        children: [
            {
                path: '',
                component: FolderDigitalEmpleadoComponent,
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
export class RhFolderDigitalEmpleadoRoutingModule{}


