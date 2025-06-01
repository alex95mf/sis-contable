import { Component, Input, OnInit } from '@angular/core';

@Component({
standalone: false,
  selector: 'app-bandeja-comercial',
  templateUrl: './bandeja-comercial.component.html',
  styleUrls: ['./bandeja-comercial.component.scss']
})
export class BandejaComercialComponent implements OnInit {

  
  Perfil = {
    nombre: 'SUPERVISOR',
    edad: 30,
    // Otros campos que necesites
  };
  constructor() { }

  ngOnInit(): void {
  }

}
