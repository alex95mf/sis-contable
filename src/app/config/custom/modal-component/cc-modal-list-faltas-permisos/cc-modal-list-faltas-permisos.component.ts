import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cc-modal-list-faltas-permisos',
  templateUrl: './cc-modal-list-faltas-permisos.component.html',
  styleUrls: ['./cc-modal-list-faltas-permisos.component.scss']
})
export class CcModalListFaltasPermisosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private dialogRef: MatDialogRef<CcModalListFaltasPermisosComponent>,) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close();
}

}
