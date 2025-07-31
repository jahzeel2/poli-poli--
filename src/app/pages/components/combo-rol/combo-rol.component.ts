import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Rol } from 'src/app/models/rol.model';
import { RolService } from 'src/app/services/rol.service';


@Component({
  selector: 'app-combo-rol',
  templateUrl: './combo-rol.component.html',
  styleUrls: ['./combo-rol.component.scss']
})
export class ComboRolComponent implements OnInit {

  @Input()
  set dibujar(item: any) {
    this.item = item;
  }

  @Output() emitir: EventEmitter<Rol> = new EventEmitter<Rol>();

  item: Rol;
  items: Rol[];
  itemss: Rol[];

  constructor(private wsdl: RolService) {
    this.item = new Rol();
    this.items = [];
    this.itemss = [];
    this.listar();
  }

  ngOnInit(): void {
    this.listar();
  }

  //captura el dato del combo
  capturar(event: Rol) {
    this.item = event;
    this.emitir.emit(this.item);
  }

  compareWitch(c1: Rol, c2: Rol): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  async listar() {
   // let listar = this.wsdl.getList();

    const dato = await this.wsdl.getList();

    const result = JSON.parse(JSON.stringify(dato));
 
    if (result.code === 200) {

      this.items = result.data;
      this.items.sort((x: any, y: any) => {
        if (x.nombre > y.nombre) {
          return 1;
        }
        if (x.nombre < y.nombre) {
          return -1;
        }
        return 0;
      });
    };
  }

        // for (var i = 0; i < this.itemss.length; i++) {
      //   const element = this.itemss[i];
      //   if (element.nombre != 'SUPERMANAGER' && element.nombre != 'DESARROLLADOR') {
      //   var igual = false;
      //   for (var j = 0; j < this.items.length && !igual; j++) {
      //     if (this.itemss[i]['id'] == this.items[j]['id']) {
      //       igual = true;
      //     }
      //   }
      //   if (!igual) {
      //       this.items.push(this.itemss[i]);
      //     }
      //   }
      // }

      // this.itemss.splice(element.id, 1);


}
