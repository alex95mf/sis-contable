import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RegistroComponent } from "./registro.component";
import { RegistroRoutingModule } from "./registro.routing";
import { AppCustomModule } from "src/app/config/custom/app-custom.module";
import { NgxCurrencyDirective } from "ngx-currency";

@NgModule({
    declarations: [RegistroComponent],
    imports: [
        CommonModule,
        RegistroRoutingModule,
        AppCustomModule,
        NgxCurrencyDirective,
    ],
    entryComponents: []
})

export class PlanRegistroModule {  }
