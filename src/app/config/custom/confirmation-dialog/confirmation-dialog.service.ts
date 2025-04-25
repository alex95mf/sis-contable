import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import {
  NgbModalConfig,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";

import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

interface BasicInputOptions {
  title: string;
  label: string;
}

interface BasicConfirmationOptions {
  title: string;
  text: string;
}

interface Options {
  config?: Partial<NgbModalOptions>;
  content?: { [key: string]: any };
}
@Injectable()
export class ConfirmationDialogService {
  constructor(
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = "OK",
    btnCancelText: string = "Cancel",
    dialogSize: "sm" | "lg" = "sm"
  ): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      size: dialogSize,
    });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }

  open(
    component: any,
    options: Options = {},
    title: string = "ModalComponent"
  ): NgbModalRef {
    const { config = {}, content = {} } = options;
    const opts = Object.assign({}, this.config, options.config);
    // Show modal and get reference object
    const modalRef = this.modalService.open(component, opts);
    modalRef.componentInstance.title = title;
    modalRef.result.then((res) => {}).catch((resultado) => {});
    // Set modal content
    Object.keys(content).forEach(
      (key) => (modalRef.componentInstance[key] = content[key])
    );
    return modalRef;
  }

  open2(component: any, options: any = {}, title: string = "ModalComponent") {
    const dialogRef = this.dialog.open(component, {
      width: "250px",
      height: "350px",
      data: { name: "this.name", animal: "this.animal" },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogMat(component: any, options: any = {}): MatDialogRef<any> {
    const dialogRef = this.dialog.open(component, {
      width: options.width,
      height: options.height,
      data: options.data,
      disableClose: options.backdrop,
    });
    return dialogRef;
  }

  openDialogBD(component: any, options: Options = {}, datos: any): NgbModalRef {
    const { config = {}, content = {} } = options;
    const opts = Object.assign({}, this.config, options.config);
    const modalRef = this.modalService.open(component, opts);
    modalRef.componentInstance.variable = datos;
    Object.keys(content).forEach(
      (key) => (modalRef.componentInstance[key] = content[key])
    );
    return modalRef;
  }
}
