import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
standalone: false,
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationsComponent implements OnInit {

  constructor(){ }

  ngOnInit() {
  }

}