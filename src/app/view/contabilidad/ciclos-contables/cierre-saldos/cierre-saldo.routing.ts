import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CierreSaldosComponent } from "./cierre-saldos.component"; 

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'cierre-de-saldos'
        },
        children: [
            {
                path: '',
                component: CierreSaldosComponent,
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
export class CierreDeSaldosRoutingModule{}