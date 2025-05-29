import { Component, OnInit } from '@angular/core';
import { CapacitacionService } from './capacitacion.service';
@Component({
standalone: false,
  selector: 'app-capacitacion',
  templateUrl: './capacitacion.component.html',
  styleUrls: ['./capacitacion.component.scss']
})
export class CapacitacionComponent implements OnInit {

  fTitle: String= "Pantalla de Ejemplo";
  vmButtons: any = [];
  vmButtons2: any = [];
  data: any[] = [];
  limpieza: any=[];
  arrayData: any=[];
  arrayData2: any=[];
  arrayData3: any=[];
  arrayData4: any=[];
  cmbPrograma: any;
  cmbDepartament: any;
  cmbAtribucion: any;
  BS: any = [];
  paginate: any;
  variableFiltro: any;
  variableFiltro2: any;
  variable3: string;
  arrayTipeDoc: any;
  fkAtr: any;
  fkAtributo: any;
  caja: Array<any> = [];
  constructor(private capacsrv: CapacitacionService) { 

  

  }

  ngOnInit(): void {
    this.vmButtons = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: "GUARDAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-success boton btn-sm",
        habilitar: false,
      },
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "far fa-square", texto: "LIMPIAR" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-warning boton btn-sm",
        habilitar: false,
      }
    ];
    this.vmButtons2 = [
      {
        orig: "btnsConceptos",
        paramAccion: "",
        boton: { icon: "fa fa-plus-square", texto: "NUEVO" },
        permiso: true,
        showtxt: true,
        showimg: true,
        showbadge: false,
        clase: "btn btn-primary boton btn-sm",
        habilitar: false,
      }
    ];

    this.paginate = {
      length: 0,
      perPage: 10,
      page: 1,
      pageSizeOptions: [5, 10, 20, 50]
    };

    this.getDataCatalogo();
  }


  /*getDataCatalogo() {

    let data = {
      cmbPrograma: cmbPrograma,
      cmbDepartament: cmbDepartament,
      cmbAtribucion:cmbAtribucion,

    }
    this.commonServices.getCatalogoByType(data).subscribe(res => {
      console.log(res);
    }, error => {
      
    })
  }*/

  getDataCatalogo() {
    let data1 = {
      params: "'PLA_PROGRAMA'",
    };
    this.capacsrv.getCatalogoByType(data1).subscribe(res => {
      console.log(res);
      this.arrayData = res['data'];
      console.log(typeof(this.arrayData));
      for (let clave in res['data']){
        this.arrayData=(res['data'][clave]);
      }
      

    });
  }


  selectOption1(evt) { 
    if (evt !== 0) {
      this.variableFiltro=evt;
      let data2 = {
        params: `'${this.variableFiltro}'`,
      };
      this.capacsrv.getCatalogoByGroup(data2).subscribe(res => {
        console.log(res);
        this.arrayData2 = res['data'];
      });
		}
    
  }

  selectOption2(evt) { 
    if (evt !== 0) {
      this.variableFiltro2=evt;
      console.log(this.variableFiltro2);
      let data3 = {
        params: `'${this.variableFiltro2}'`,
      };
      this.capacsrv.getCatalogoByGroup(data3).subscribe(res => {
        console.log(res);
        this.arrayData3 = res['data'];
      });

      
		}
    
  }

  consultarHandler() {
    //console.log("valor de select3 seleccionado: ", this.cmbAtribucion)
    let select3 = {
      params: `${this.cmbAtribucion}`,
    };
    this.capacsrv.getDataAtribucion(select3).subscribe(res => {
      this.fkAtr=(res['data'][0].indicador);
      this.fkAtributo=(res['data'][0].fk_atributo);
      let select4 = {
        params: `${this.fkAtributo}`,
      };
      this.capacsrv.getBienes(select4).subscribe(res => {
        console.log(res);
      });

    });
    
   
    
    

  }



  metodoGlobal(event) {
    switch (event.items.boton.texto) {
      case "GUARDAR":
        //this.showConceptoForm(true, {});
        break;
      case "LIMPIAR":
        this.limpiar();
        break;
    }
  }

  nuevoHandler() {
    let obj: any = {
      attr1: this.cmbPrograma,
      attr2: this.cmbDepartament,
      attr3: this.cmbAtribucion,
      attr4: this.BS,
    }
    this.data.push(obj)
    this.paginate.length = this.data.length
  }


  limpiar() {
      this.cmbPrograma= "";
      this.cmbDepartament= "";
      this.cmbAtribucion= "";
      this.BS=0;
      this.data= [];
    
  }

  changePaginate(event) {
    let newPaginate = {
      perPage: event.pageSize,
      page: event.pageIndex + 1,
    }
    Object.assign(this.paginate, newPaginate);

  }



}
