import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import { Cifrado } from 'src/app/utils/cifrado';
import { Utils } from 'src/app/utils/utils';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-fil-usuarios-criminalistica',
  templateUrl: './fil-usuarios-criminalistica.component.html',
  styleUrls: ['./fil-usuarios-criminalistica.component.scss'],
})
export class FilUsuariosCriminalisticaComponent implements OnInit {
  @Output() emmit: EventEmitter<UsuariosCriminalistica[]> = new EventEmitter();

  busqueda: any;
  items: UsuariosCriminalistica[];

  paginaAnterior!: number;
  anterior: boolean;
  paginaActual: number;
  siguiente: boolean;
  paginaSiguiente!: number;
  totalRegistros!: number;
  totalPaginas!: number;
  public limit: any;
  public unidad:any;
  public limits: Number[] = [5, 10, 25];

  constructor(private wsdl: UsuarioCriminalisticaService) {
    this.busqueda = '';
    this.items = [];

    this.limit = 25;
    this.paginaActual = 1;
    this.siguiente = false;
    this.anterior = false;
  }

  ngOnInit(){
    this.filter();
  }

  setPage(page: any, estado: any) {
    this.paginaActual = page;
    if (estado == 'siguiente') {
      this.paginaSiguiente = this.paginaActual + 1;
      this.paginaActual = this.paginaSiguiente;
    }
    if (estado == 'anterior') {
      this.paginaAnterior = this.paginaActual - 1;
      this.paginaActual = this.paginaAnterior;
    }
    this.filter();
  }

  async filter() {
    this.unidad = Number(JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5)).unidad);
    console.log("lezca",this.unidad);

    try {
      if (this.busqueda == '' || this.busqueda == undefined) {
        let data = await this.wsdl.getList()
          ;
          const result = JSON.parse(JSON.stringify(data));
          console.log(data,"22222222222");

        if (result.code == 200) {
          this.items = result.data;
          this.totalRegistros = result.totalRegistros;
          this.totalPaginas = result.totalPaginas;

          this.emmit.emit(this.items);
        }
      } else if (this.busqueda != undefined && this.busqueda != '') {
        let data = await this.wsdl.doFilter(this.busqueda,this.unidad).then();
        const result = JSON.parse(JSON.stringify(data));
        ;
        if (result.code == 200) {
          this.items = result.data;
          this.emmit.emit(this.items);
        } else if (result.code == 204) {
          this.items = result.data;
          this.emmit.emit(this.items);
        }
      }
    } catch (error) {}
  }
}
