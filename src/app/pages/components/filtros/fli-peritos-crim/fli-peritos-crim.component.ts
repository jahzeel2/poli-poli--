import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PeritosService } from '../../../../services/peritos.service'; // Ruta corregida
import { Perito } from '../../../../models/perito.model';          // Ruta corregida
import { Utils } from '../../../../utils/utils';
import { Cifrado } from 'src/app/utils/cifrado';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-fli-peritos-crim',
  templateUrl: './fli-peritos-crim.component.html',
  styleUrls: ['./fli-peritos-crim.component.scss']
})
export class FliPeritosCrimComponent implements OnInit {
  @Output() emmit: EventEmitter<Perito[]> = new EventEmitter();

  busqueda: any;
  items: Perito[];

  paginaAnterior!: number;
  anterior: boolean;
  paginaActual: number;
  fechaBaja!:any;
  usuarioBaja!:number;
  siguiente: boolean;
  paginaSiguiente!: number;
  totalRegistros!: number;
  totalPaginas!: number;
  public limit: any;
  public limits: Number[] = [5, 10, 25];
  public unidad: number = 1;

  constructor(private wsdl:  PeritosService) {
    this.busqueda = '';
    this.items = [];

    this.limit = 5;
    this.paginaActual = 1;
    this.siguiente = false;
    this.anterior = false;
  }

  ngOnInit(): void {
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
    try {
      if (this.busqueda == '' || this.busqueda == undefined) {
        const consulta = this.wsdl.getList(this.paginaActual,this.limit,this.unidad);
        let data = await lastValueFrom(consulta);
        console.log("elultimo",data);
        const result = JSON.parse(JSON.stringify(data));
        console.log('elmismo',result);


        if (result.code == 200) {
          this.items = result.data;
          this.totalRegistros = result.totalRegistros;
          this.totalPaginas = result.totalPaginas;
          this.emmit.emit(this.items);
        }
      } else if (this.busqueda != undefined && this.busqueda != '') {
        const consulta = await this.wsdl.filter(this.busqueda, this.unidad);
        const result = JSON.parse(JSON.stringify(await consulta));

        if (result.code == 200) {
          this.items = result.data;
          this.emmit.emit(this.items);
        } else if (result.code == 204) {
          this.items = result.data;
          this.emmit.emit(this.items);
        }
      }
    } catch (error) {
      // Manejar el error adecuadamente aquí
    }
  }
}
