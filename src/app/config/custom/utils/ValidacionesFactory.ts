import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

export class ValidacionesFactory {
  /*nueva funcion que recibe la cantidad de nuemeros decimales de precision que debe usar para el redondeo*/
  roundNumber(number, precision) {
    if (number === null || String(number).trim() === "") {
      return number;
    }
    if (isNaN(number)) {
      return (number = "0.00");
    }
    if (isNaN(precision)) {
      precision = 2;
    } else if (precision != 0) {
      precision = Math.abs(parseInt(precision)) || 2;
    }
    let multiplier = Math.pow(10, precision);
    let result: any = Math.round(number * multiplier) / multiplier;
    if (precision === 0) {
      result += ".00";
    } else {
      result = Number(result).toFixed(precision);
    }
    return result;
  }

  obtenerKeyValorLista(listado, identificador) {
    let result = null;
    for (var key in listado) {
      if (identificador === key) {
        result = listado[key];
      }
    }
    return result;
  }

  //Metodo que valida solo numeros: se lo utiliza en el html: (keypress)="validaciones.numberOnly($event)"
  // o en el .ts: if((keypress)=this.validaciones.numberOnly($event))[...]
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onlyWord(event):boolean{
    let key = event.which ? event.which : event.keyCode;
    if (key > 31 && (key < 48 || key > 57)) {
      return true;
    }
    return false;
  }

  numberOnlyDot(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  verSiEsNull(valor) {
    if (
      valor === undefined ||
      valor === null ||
      valor === "" ||
      valor === "null"
    ) {
      valor = undefined;
    }
    return valor;
  }

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  public mensajeExito(titulo, mensaje) {
    Swal.fire({icon: "success", title: titulo, text: mensaje, showCloseButton: true, showConfirmButton: false});
  }

  public mensajeError(titulo, mensaje) {
    Swal.fire({icon: "error", title: titulo, text: mensaje, showCloseButton: true, showConfirmButton: false});
  }
  public mensajeAdvertencia(titulo, mensaje) {
    Swal.fire({icon: "warning", title: titulo, text: mensaje, showCloseButton: true, showConfirmButton: false});
  }
  public mensajeInfo(titulo, mensaje) {
    Swal.fire({icon: "info", title: titulo, text: mensaje, showCloseButton: true, showConfirmButton: false});
  }

  obtenerTipoRubro(tipo: any, listaDeRubros: any, empleado?:any) {
    const rubro: any = listaDeRubros.filter((datos) => datos.id_parametro == tipo);
    let datos = null;
    if (rubro.length > 0) {
      datos = {
        c_d: rubro[0].c_d,
        cantidad_unificado: rubro[0].cantidad_unificado,
        clase: rubro[0].clase,
        codigo: rubro[0].codigo,
        created_at: rubro[0].created_at,
        cuenta: rubro[0].cuenta,
        cuenta_data: rubro[0].cuenta_data,
        estado: rubro[0].estado,
        fk_empresa: rubro[0].fk_empresa,
        id_parametro: rubro[0].id_parametro,
        nombre: rubro[0].nombre,
        nombre_cuenta: rubro[0].nombre_cuenta,
        sueldo: rubro[0].sueldo,
        sueldo_multa: rubro[0].sueldo_multa,
        tipo: rubro[0].tipo,
        formula: rubro[0].formula,
        tipo_calculo: rubro[0].tipo_calculo,
        updated_at: rubro[0].updated_at,
        valor: rubro[0].valor,
        valor_cantidad: rubro[0].valor_cantidad,
        afiliado: rubro[0].afiliado,
        empleado: empleado
      };
    }
    return datos;
  }

  calcularTotalesIngresos(lstTotalIngresos: any, lstTablaEmpleados: any) {
    let listaRubrosIngresos: any = [];
    let contadorRubros: any = 0;
    lstTablaEmpleados.forEach((element) => {
      listaRubrosIngresos.push(element.datoRubro);
      contadorRubros = element.datoRubro.length;
    });
    let contador1: any = 0;
    for (let index = 0; index < contadorRubros; index++) {
      let idParametro: any = null;
      let totalValor: any = 0;
      listaRubrosIngresos.forEach((element) => {
        idParametro = element[contador1].id_parametro;
        let resultado: any = element.find((datos) => datos.id_parametro == idParametro);
        if (resultado) {
          totalValor = Number(totalValor) + Number(resultado.valor_cantidad);
        }
      });
      lstTotalIngresos.push({id_parametro: idParametro == undefined ? 0 : idParametro, totalValor: totalValor,});
      contador1++;
    }
    return lstTotalIngresos;
  }

  calcularTotalesEgresos(lstTotalEgresos: any, lstTablaEmpleados: any) {
    let listaRubrosEgresos: any = [];
    let contadorRubros: any = 0;
    lstTablaEmpleados.forEach((element) => {
      if(element.datoRubroEgr!=undefined){
        listaRubrosEgresos.push(element.datoRubroEgr);
        contadorRubros = element.datoRubroEgr.length;
      }      
    });
    let contador1: any = 0;
    for (let index = 0; index < contadorRubros; index++) {
      let idParametro: any = null;
      let totalValor: any = 0;
      listaRubrosEgresos.forEach((element) => {
        idParametro = element[contador1].id_parametro;
        let resultado: any = element.find((datos) => datos.id_parametro == idParametro);
        if (resultado) {
          totalValor = Number(totalValor) + Number(resultado.valor_cantidad);
        }
      });
      lstTotalEgresos.push({id_parametro: idParametro == undefined ? 0 : idParametro, totalValor: totalValor,});
      contador1++;
    }
    return lstTotalEgresos;
  }

  calcularValorNetoRecibir(lstTablaEmpleados: any) {
    let resultadoReciTotal = 0;
    lstTablaEmpleados.forEach((element, index) => {
      let totalIngreso: number = 0;
      let totalEgreso: number = 0;
      element.datoRubro.forEach((element2) => {
        if (element2.nombre == "TOTAL INGRESOS") {
          totalIngreso = element2.valor_cantidad;
        }
      });
      if (element.datoRubroEgr != undefined) {
        element.datoRubroEgr.forEach((element2) => {
          if (element2.nombre == "TOTAL EGRESOS") {
            totalEgreso = element2.valor_cantidad;
          }
        });
      }
      element.valorNetoRecibir = totalIngreso - totalEgreso;
      resultadoReciTotal =
        Number(resultadoReciTotal) + Number(element.valorNetoRecibir);
    });
    return resultadoReciTotal;
  }

  calcularIngresos(lstTablaEmpleados: any) {
    let calcular: number = 0;
    lstTablaEmpleados.forEach((element, index) => {
      element.datoRubro.forEach((element2, index2) => {
        if (element2.nombre == "TOTAL INGRESOS") {
          element.datoRubro.splice(index2, 1);
        }
        if (element2.tipo == "Ingreso") {
          calcular = Number(calcular) + Number(element2.valor_cantidad);
        }
      });
      let valor: any = {
        valor_cantidad: calcular,
        nombre: "TOTAL INGRESOS",
        tipo_calculo: "S",
      };
      element.datoRubro.push(valor);
      calcular = 0;
    });
  }

  calcularEgresos(lstTablaEmpleados: any) {
    let calcular: number = 0;
    lstTablaEmpleados.forEach((element, index) => {
      if (element.datoRubroEgr != undefined && element.datoRubroEgr.length>0) {
        element.datoRubroEgr.forEach((element2, index2) => {
          if (element2.nombre == "TOTAL EGRESOS") {
            element.datoRubroEgr.splice(index2, 1);
          }
          if (element2.tipo == "Egreso") {
            calcular = Number(calcular) + Number(element2.valor_cantidad);
          }
        });
        let valor: any = {
          valor_cantidad: calcular,
          nombre: "TOTAL EGRESOS",
          tipo_calculo: "S",
        };
        element.datoRubroEgr.push(valor);
        calcular = 0;
      }
    });
  }

  validarEmail(valor) {
    if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(valor)) {
      return true;
    } else {
      return false;
    }
  }

  validaInputsVacio(input: any, mensaje: any, idInput: any) {
    let resultado: boolean = false;
    if (this.verSiEsNull(input) == undefined) {
      this.mensajeAdvertencia("Advertencia", mensaje);
      let autFocus = document.getElementById(idInput).focus();
      resultado = true;
    }
    return resultado;
  }

  //2021-09-16  <-- formato fecha
  calculateAge(fechaNacimiento) {
    let fNacArr = fechaNacimiento.split("-");
    let nacDate = new Date(fNacArr[0], fNacArr[1] - 1, fNacArr[2]);
    let ageDifMs = Date.now() - nacDate.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  /* Función que suma o resta días a una fecha, si el parámetro
   días es negativo restará los días -> la fecha debe ser de tipo Date()*/
  sumarDias(fecha:any, dias:any){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }

  //YYYY-MM-DD fNacArr[0], fNacArr[1] - 1, fNacArr[2]
  validaPeriodoFechas(fechaEntre:any, fechaInicio:any, fechaFin:any){
    let fechaEmision = fechaEntre;
    fechaEmision = fechaEmision.split("-");
    const lfechaEmision = new Date(+fechaEmision[0], fechaEmision[1] - 1, +fechaEmision[2]);

    let lfechaInicio:any = String(fechaInicio).split("-");
    let lfechaFin:any = String(fechaFin).split("-");

    let fechauno = new Date(+lfechaInicio[0], lfechaInicio[1] - 1, +lfechaInicio[2]);
    let fechados = new Date(+lfechaFin[0], lfechaFin[1] - 1, +lfechaFin[2]);
  
    let resultado = false;     
    if(lfechaEmision.getTime()>=fechauno.getTime() && fechados.getTime()>=lfechaEmision.getTime()){
      resultado = true;
    } 
    return resultado;    
  }


  listadoComponentesEtiquetas(){
    return [
      { nombre:  'app-dashboard', tipo: "/dashboard"  },
      { nombre:  'app-usuarios-online', tipo: "/sistemas/userconectados"},
      { nombre:  'app-bitacora', tipo: "/sistemas/bitacora" },
      { nombre:  'app-general', tipo: "/sistemas/parametros/general" },
      { nombre:  'app-empresarial', tipo: "/sistemas/parametros/empresarial" },
      { nombre:  'app-seguridad', tipo: "/sistemas/seguridad" },
      { nombre:  'app-plan-cuentas', tipo: "/contabilidad/plandecuentas"  },
      { nombre:  'app-diario', tipo: "/contabilidad/comprobantes/diario"  },
      { nombre:  'app-egreso', tipo: "/contabilidad/comprobantes/egreso"  },
      { nombre:  'app-ingreso-comprobantes', tipo: "/contabilidad/comprobantes/ingreso"  },
      { nombre:  'app-balancecomprobacion', tipo: "/contabilidad/reportes/balancecomprobacion"  },
      { nombre:  'app-movimientos-contable', tipo: "/contabilidad/reportes/movimientoscontable"  },
      { nombre:  'app-estado-resultado', tipo: "/contabilidad/estadofinanciero/estadoresultado"  },
      { nombre:  'app-balance-general', tipo: "/contabilidad/estadofinanciero/balancegeneral"  },
      { nombre:  'app-adquisiciones', tipo: "/contabilidad/activofijo/adquisiciones"  },
      { nombre:  'app-parametros', tipo: "/contabilidad/activofijo/parametros"  },
      { nombre:  'app-depreciacion', tipo: "/contabilidad/activofijo/depreciacion"  },
      { nombre:  'app-etiqueta-acfijo', tipo: "/contabilidad/activofijo/etiqueta"  },
      { nombre:  'app-reporte-acfijo', tipo: "/contabilidad/activofijo/consulta"  },
      { nombre:  'app-cc-mantenimiento', tipo: "/contabilidad/centrodecosto/mantenimiento"  },
      { nombre:  'app-consulta-centro', tipo: "/contabilidad/centrodecosto/consulta"  },      
      { nombre:  'app-empleado', tipo: "/administracion/nomina/empleado"  },
      { nombre:  'app-documentos', tipo: "/administracion/nomina/documentos"  },
      { nombre:  'app-carga-familiar', tipo: "/administracion/nomina/carga-familiar"  },
      { nombre:  'app-grupo', tipo: "/administracion/grupo"  },
      { nombre:  'app-parametroad', tipo: "/administracion/parametro"  },
      { nombre:  'app-prestamos', tipo: "/administracion/prestamos"  },
      { nombre:  'app-adm-rol-pago', tipo: "/administracion/adm-rol-pago"  },
      { nombre:  'app-adm-anticipo', tipo: "/administracion/adm-anticipo"  },
      { nombre:  'app-adm-decimo-tercero', tipo: "/administracion/adm-decimo-tercero"  },
      { nombre:  'app-adm-decimo-cuarto', tipo: "/administracion/adm-decimo-cuarto"  },
      { nombre:  'app-ingreso-producto', tipo: "/inventario/producto/ingreso"  },
      { nombre:  'app-consulta-producto', tipo: "/inventario/producto/consulta"  },
      { nombre:  'app-precios', tipo: "/inventario/producto/precios"  },
      { nombre:  'app-lista', tipo: "/inventario/producto/lista"  },
      { nombre:  'app-ofertas', tipo: "/inventario/producto/ofertas"  },
      { nombre:  'app-bodega-ingreso', tipo: "/inventario/bodega/stockBodega"  },
      { nombre:  'app-bodega-compras', tipo: "/inventario/bodega/compras"  },
      { nombre:  'app-bodega-distribuir', tipo: "/inventario/bodega/distribuir"  },
      { nombre:  'app-bodega-despacho', tipo: "/inventario/bodega/despacho"  },
      { nombre:  'app-toma-fisica', tipo: "/inventario/tomafisica"  },      
      { nombre:  'app-customers-register', tipo: "/venta/cliente/registro"  },
      { nombre:  'app-nota-credito', tipo: "/venta/cliente/notacredito"  },
      { nombre:  'app-nota-debito', tipo: "/venta/cliente/notadebito"  },
      { nombre:  'app-customers-consult', tipo: "/venta/cliente/consulta"  },
      { nombre:  'app-quotes', tipo: "/venta/cotizaciones"  },
      { nombre:  'app-reports', tipo: "/venta/aprobaciones"  },
      { nombre:  'app-invoice-sales', tipo: "/venta/invoice/fisica"  },
      { nombre:  'app-point-sales', tipo: "/venta/invoice/punto"  },
      { nombre:  'app-sales-electronic', tipo: "/venta/invoice/electronica"  },
      { nombre:  'app-reports-invoice', tipo: "/venta/invoice/reporte"  },
      { nombre:  'app-reports-quotes', tipo: "/venta/reportes"  },
      { nombre:  'app-busqueda-producto', tipo: "/venta/busqueda"  },
      { nombre:  'app-asignacion-cliente', tipo: "/venta/asignacion"  },
      { nombre:  'app-devoluciones', tipo: "/venta/devoluciones"  },
      { nombre:  'app-retencion-venta', tipo: "/venta/retencion"  },      
      { nombre:  'app-solicitud', tipo: "/compra/solicitudes"  },
      { nombre:  'app-ordenes', tipo: "/compra/ordenes"  },
      { nombre:  'app-factura-compra', tipo: "/compra/facturacion"  },
      { nombre:  'app-suppliers', tipo: "/compra/proveedores"  },
      { nombre:  'app-reports-compra', tipo: "/compra/reportes"  },
      { nombre:  'app-kardex', tipo: "/compra/kardex"  },
      { nombre:  'app-retencion-compra', tipo: "/compra/retencion"  },
      { nombre:  'app-apertura', tipo: "/bancos/cajageneral/apertura"  },
      { nombre:  'app-cierre', tipo: "/bancos/cajageneral/cierre"  },
      { nombre:  'app-consulta-caja', tipo: "/bancos/cajageneral/consulta"  },
      { nombre:  'app-creacion', tipo: "/bancos/cajachica/creacion"  },
      { nombre:  'app-vale', tipo: "/bancos/cajachica/vales"  },
      { nombre:  'app-consulta-cajach', tipo: "/bancos/cajachica/consulta"  },
      { nombre:  'app-bancarias', tipo: "/bancos/cuentas/bancaria"  },
      { nombre:  'app-bovedas', tipo: "/bancos/cuentas/boveda"  },
      { nombre:  'app-transacciones', tipo: "/bancos/transacciones"  },
      { nombre:  'app-conciliacion', tipo: "/bancos/conciliacion"  },
      { nombre:  'app-reportes-bancos', tipo: "/bancos/reportes"  },      
      { nombre:  'app-cobranza', tipo: "/cartera/monitor/cobranza"  },
      { nombre:  'app-reporte-cobranzas', tipo: "/cartera/monitor/reporte"  },
      { nombre:  'app-nota-debito-cartera', tipo: "/cartera/notadebito"  },
      { nombre:  'app-cheques-post', tipo: "/cartera/chequespost"  },
      { nombre:  'app-cheques-post', tipo: "/cxp/proveedores"  },
      { nombre:  'app-reporte-cxp', tipo: "/cxp/reporte-cxp"  },
      { nombre:  'app-compras', tipo: "/proveeduria/compras"  },
      { nombre:  'app-egresos', tipo: "/proveeduria/egresos"  },
      { nombre:  'app-productos', tipo: "/proveeduria/productos"  },
      { nombre:  'app-reportes', tipo: "/proveeduria/reportes"  },
      { nombre:  'app-pagos-servicios', tipo: "/proveeduria/pago-servicio"  },
      { nombre:  'app-pedidos', tipo: "/importacion/pedido"  },
      { nombre:  'app-gastos', tipo: "/importacion/gastos"  },
      { nombre:  'app-cierre-pedido', tipo: "/importacion/cierre-pedido"  },
      { nombre:  'app-liquidaciones', tipo: "/importacion/liquidaciones"  }
    ]
  }
}


