import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Editor, toDoc } from 'ngx-editor';
import { FacElectronicaService } from '../fac-electronica.service';

@Component({
  selector: 'app-editar-xml',
  templateUrl: './editar-xml.component.html',
  styleUrls: ['./editar-xml.component.scss']
})
export class EditarXmlComponent implements OnInit, OnDestroy {

  vmButtons:any=[];
  editor: any;
  html: '';
  codigoAcceso:any = "";

  constructor(
    private dialogRef: MatDialogRef<EditarXmlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private facElectronicaService: FacElectronicaService
  ) { }

  ngOnInit(): void {

    this.vmButtons = [
      { orig: "btnEditXml", paramAccion: "", boton: { icon: "fa fa-times", texto: "GUARDAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-primary btn-sm", habilitar: false, imprimir: false},
      { orig: "btnEditXml", paramAccion: "", boton: { icon: "fa fa-floppy-o", texto: "CERRAR" }, permiso: true, showtxt: true, showimg: true, showbadge: false, clase: "btn btn-info btn-sm", habilitar: false, imprimir: false}
    ];

    this.codigoAcceso = "";
    this.codigoAcceso = this.data.item.codigo_acceso;

    this.editor = new Editor();
    this.editor.commands
    .insertText(this.data.textoXML)
    .focus()
    .scrollIntoView()
    .exec();

  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  metodoGlobal(evento: any) {
    switch (evento.items.boton.texto) {
      case "GUARDAR":

      const jsonDoc = toDoc(this.html);
      console.log("jsonDoc: ", this.editor)
      let datoEnviar = {
        xmlEditado: this.editor.view.dom.innerText,
        codigo_acceso: this.codigoAcceso
      }

      console.log("datoEnviar: ", datoEnviar, this.editor)

      this.facElectronicaService.guardarXMLEditado(datoEnviar).subscribe((datos:any)=>{

      }, error=>{

      })

        
      break;
      case "CERRAR":
        this.dialogRef.close(false);
      break;
    }   
  }

  form = new FormGroup({
    editorContent: new FormControl(
      { value: null, disabled: false },
    )
  });

  doc(): AbstractControl {
    return this.form.get("editorContent");
  }

}
