import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bandeja-vendedor',
  templateUrl: './bandeja-vendedor.component.html',
  styleUrls: ['./bandeja-vendedor.component.scss']
})
export class BandejaVendedorComponent implements OnInit {

  
  Perfil = {
    nombre: 'ASESOR',
    edad: 30,
    // Otros campos que necesites
  };
  constructor() { }

  ngOnInit(): void {
  }

}
