import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

//import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true               
};

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'; 

import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { AppRoutingModule } from './app.routing';

import { AppSettings } from './app.settings';
import { AppComponent } from './app.component';


import { TopInfoContentComponent } from './theme/components/top-info-content/top-info-content.component';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { NavbarComponent } from './theme/components/navbar/navbar.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FavoritesComponent } from './theme/components/favorites/favorites.component';
import { AppCustomModule } from './config/custom/app-custom.module';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';


  
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common'; 
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from "@angular/common"; 
import { NgxPrintModule } from 'ngx-print';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations'; 
import { ApiServices } from './services/api.service' 
import { FlatpickrModule } from 'angularx-flatpickr';
import { GuardSystem } from './services/guardSystem';
import { AuthorizationService } from './services/auth-service';
import { GuardLogin } from './services/guardLogin.service'; 
import { Socket } from './services/socket.service'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MaintenanceComponent } from './view/comercializacion/facturacion/maintenance/maintenance.component'; 
import { NgxBarcodeModule } from 'ngx-barcode'; 
import { BarcodeGeneratorAllModule, QRCodeGeneratorAllModule, DataMatrixGeneratorAllModule } from '@syncfusion/ej2-angular-barcode-generator';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

  
  
  /* Import containers */
  
  import { P404Component } from './view/error/404.component';
  import { P500Component } from './view/error/500.component';
  
  /* import servicios */
  import { CommonService } from './services/commonServices';
  import { CommonVarService } from './services/common-var.services';
  import 'flatpickr/dist/flatpickr.css';
  import { CookieService } from 'ngx-cookie-service';
  
  
  const APP_CONTAINERS = [
    DefaultLayoutComponent
  ];
  
  import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppHeaderModule,
    AppFooterModule,
    AppSidebarModule,
  } from '@coreui/angular';
   
  import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
  import { TabsModule } from 'ngx-bootstrap/tabs';
  import { ChartsModule } from 'ng2-charts';
  import { HomeComponent } from './view/home/home.component';
  import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
  import { EditPassComponent } from './containers/default-layout/edit-pass/edit-pass.component';
  import { DefaultLayoutComponent } from './containers';
  import { NewHomeComponent } from './view/new-home/new-home.component';
  import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA8Az-fACp3ukURt5H5bUoz5bI-g0Ax5V4'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    PerfectScrollbarModule,     
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    SharedModule,
    PipesModule,
    AppRoutingModule,
    


    AppCustomModule,
    DatePickerModule,
    QRCodeModule,
    HttpClientModule,
    DataTablesModule,
    NgSelectModule, 
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule, 
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    CommonModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    NgxPrintModule,
    TreeViewModule,
    InfiniteScrollModule,
    NgbModule,
    NgxBarcodeModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    NgMultiSelectDropDownModule.forRoot()
    
  ],
  declarations: [
    AppComponent,
    TopInfoContentComponent,
    SidenavComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FavoritesComponent,


 
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    HomeComponent,
    NewHomeComponent,
    EditPassComponent,
    MaintenanceComponent,

  ],
  entryComponents: [
    VerticalMenuComponent,
    EditPassComponent
  ],
  providers: [
    AppSettings,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },



    { provide: LocationStrategy, useClass: HashLocationStrategy },
    ApiServices,
    CommonService,
    CommonVarService,
    CookieService,
    GuardSystem,
    AuthorizationService,
    GuardLogin,
    Socket
  ],
  bootstrap: [
    AppComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
