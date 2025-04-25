import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bandeja-bodega',
  templateUrl: './bandeja-bodega.component.html',
  styleUrls: ['./bandeja-bodega.component.scss']
})
export class BandejaBodegaComponent implements OnInit {

  
  Perfil = {
    nombre: 'BODEGA',
    edad: 30,
    // Otros campos que necesites
  };
  constructor() { }

  ngOnInit(): void {
  }

}
