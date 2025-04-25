import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import { ToastrService } from 'ngx-toastr';
import {TopSenMailService} from './top-info-content.service'

@Component({
  selector: 'app-top-info-content',
  templateUrl: './top-info-content.component.html',
  styleUrls: ['./top-info-content.component.scss']
})
export class TopInfoContentComponent implements OnInit {
  @Input('showInfoContent') showInfoContent:boolean = false;
  @Input('dataUser') dataUser:any;
  @Output() onCloseInfoContent: EventEmitter<any> = new EventEmitter();
  contactForm: FormGroup;
  controls = [
    { name: 'Notifications', checked: true },
    { name: 'Tasks', checked: true },
    { name: 'Events', checked: false },
    { name: 'Downloads', checked: true },
    { name: 'Messages', checked: true },
    { name: 'Updates', checked: false },
    { name: 'Settings', checked: true }
  ]
  flag:any = false;
  point = "";
  cont = 0;
  constructor(public formBuilder: FormBuilder,private toastSrv:ToastrService,private topSrv:TopSenMailService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
      values['email_user'] = this.dataUser.email;
      values['username'] = this.dataUser.nombre;
      this.flag = true;
      if(this.flag){
        setInterval(() => this.ejecutePoint(), 250); 
      }
      this.topSrv.sendMailUser(values).subscribe(res =>{
        this.toastSrv.success("Correo enviado con éxito");
        this.flag = false;
        this.contactForm.get('email').patchValue("");
        this.contactForm.get('subject').patchValue("");
        this.contactForm.get('message').patchValue("");
      }, error=>{
        this.toastSrv.info(error.error.message);
        this.flag = false;
      })
    }
  }

  ejecutePoint(){
    this.cont += 1;
    if(this.cont == 3){
      this.cont = 0;
    }
    if(this.cont  < 6){
      this.point = this.point + ".";
    }else{
      this.point = "";
    }
  }



  public closeInfoContent(event){
    this.onCloseInfoContent.emit(event);
  }

  sendMailTheme(){

  }

}
