import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { ToastrService } from 'ngx-toastr';
import { cbtn } from 'src/app/config/custom/cc-buttons/buttons.componente';
import { CcSpinerProcesarComponent } from 'src/app/config/custom/cc-spiner-procesar.component';
import { PlanCuentasTreeService } from './plan-cuentas-tree.service';

interface FlatNode {
  expandable: boolean
  cuenta: string
  descripcion: string
  padre: string
  nivel: string
  clase: string
  children?: any
  level?: number
}

@Component({
standalone: false,
  selector: 'app-plan-cuentas-tree',
  templateUrl: './plan-cuentas-tree.component.html',
  styleUrls: ['./plan-cuentas-tree.component.scss']
})
export class PlanCuentasTreeComponent implements OnInit {
  @ViewChild(CcSpinerProcesarComponent, {static: false}) lcargando: CcSpinerProcesarComponent;
  mensajeSpinner: string;
  vmButtons: cbtn[] = [];

  // treeControl = new NestedTreeControl<any>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<any>();

  constructor(
    private apiService: PlanCuentasTreeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    setTimeout(async () => this.refresh(), 0)
  }

  async refresh() {
    this.lcargando.ctlSpinner(true)
    await this.getCuentas()
    this.lcargando.ctlSpinner(false)
  }

  async getCuentas() {
    try {
      this.mensajeSpinner = 'Cargando Cuentas'
      const response = await this.apiService.getCuentasArbol()
      let arreglo_tree = ((response['data'])[0].json_agg).replaceAll("child3", "child").replaceAll("child4", "child").replaceAll("child5", "child").replaceAll("child6", "child").replaceAll("child7", "child").replaceAll("child", "children");
      const arbol = JSON.parse(arreglo_tree);
      console.log(arbol)
      //
      this.dataSource.data = arbol
      // this.treeControl.dataNodes = arbol
      // this.treeControl.expandAll()
    } catch (err) {
      console.log(err)
      this.toastr.error(err.error?.message, 'Error cargando Cuentas')
    }
  }

  private _transformer = (node: any, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      cuenta: node.cuenta,
      descripcion: node.descripcion,
      padre: node.padre,
      nivel: node.nivel,
      clase: node.clase,
      children: node.children,
      level: level
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: any) => node.expandable;

}
