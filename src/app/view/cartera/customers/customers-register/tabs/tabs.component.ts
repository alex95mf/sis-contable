import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../../services/commonServices';
@Component({
standalone: false,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  constructor(private commonServices: CommonService) { }

  ngOnInit(): void {
  }

}
