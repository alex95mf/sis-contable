import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit {

  @Input() ext: any;
  @Input() uri: any;
  @Input() product: any;
  @Input() lstorage: any;
  general: any = "";

  
  
  constructor(public activeModal: NgbActiveModal, private toastr: ToastrService,
    private modalSrv: ModalService) { }

  ngOnInit(): void {

    console.log("ingresando");
    this.general = URL.createObjectURL(this.lstorage);

  }

  /* actions modals */
  closeModal() {
    this.activeModal.dismiss();
  }
}