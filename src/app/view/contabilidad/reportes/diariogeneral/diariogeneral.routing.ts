import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DiariogeneralComponent } from "./diariogeneral.component"; 

export const routes: Routes = [
    {
        path: '',
        data: {
            title: 'diariogeneral'
        },
        children: [
            {
                path: '',
                component: DiariogeneralComponent,
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
export class DiarioGeneralRoutingModule{}


