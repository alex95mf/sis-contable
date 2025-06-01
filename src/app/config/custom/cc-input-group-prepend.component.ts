import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
standalone: false,
  selector: "app-cc-input-group-prepend",
  template: `
    <div class="input-group input-group-sm mt-1">
      <div class="input-group-prepend" (click)="accionClickSpan()" [matTooltip]="spanToolTip">
        <span class="input-group-text {{ styleSpan }}" id="inputGroup-sizing-sm" style="font-weight: 600;font-size: 11px;">{{ label }}</span>
      </div>
      <ng-content></ng-content>
    </div>
  `,
})
export class CcInputGroupPrepend implements OnInit {
  constructor() {}
  @Input() label;
  @Input() styleSpan;
  @Input() div1;
  @Input() div2;
  @Input() styleGroup;
  @Input() spanToolTip: any = "";

  ngOnInit() {
    this.spanToolTip = this.label;
  }

  @Output() onAccionClickSpan: EventEmitter<any> = new EventEmitter();
  accionClickSpan() {
    this.onAccionClickSpan.emit();
  }
}
