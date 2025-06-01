import { Component, Input, OnInit } from '@angular/core';

@Component({
standalone: false,
  selector: 'app-bandeja-credito',
  templateUrl: './bandeja-credito.component.html',
  styleUrls: ['./bandeja-credito.component.scss']
})
export class BandejaCreditoComponent implements OnInit {

  
  Perfil = {
    nombre: 'CREDITO',
    edad: 30,
    // Otros campos que necesites
  };
  constructor() { }

  ngOnInit(): void {
  }

}
