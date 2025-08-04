import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Utils } from 'src/app/utils/utils';

import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';

import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';
import { Cifrado } from 'src/app/utils/cifrado';
import { FilUsuariosCriminalisticaComponent } from '../../filtros/fil-usuarios-criminalistica/fil-usuarios-criminalistica.component';


@Component({
  selector: 'app-lst-usuario',
  templateUrl: './lst-usuario.component.html',
  styleUrls: ['./lst-usuario.component.scss']
})
export class LstUsuarioComponent implements OnInit {

  @ViewChild(FilUsuariosCriminalisticaComponent, { static: false })
  fil!: FilUsuariosCriminalisticaComponent;

  @ViewChild('close')
  cerrar!: ElementRef;

  exportar: boolean = false;
  items: UsuariosCriminalistica[];
  item: UsuariosCriminalistica;

  crit: any;
  procesando!: Boolean;
  public load!: boolean;

  public nombre: string = 'Central Comunicaciones';
  public url: string = 'https://10.125.31.214/central/';
  public activoSistema: boolean = false;

  TipoUsuario!: string;

  entidad = 'lst-usuarios';
  nombreUsu = '';
  rol = 0;

  constructor(
    private wsdl: UsuarioCriminalisticaService,
    private wsdlRegistro:RegistroUsuarioService,
    private router: Router
  ) {
    this.load = false;
    this.item = new UsuariosCriminalistica();
    this.items = [];
    this.rol = 0;
  }

  ngOnInit(): void {
    this.rol = JSON.parse(
      Cifrado.descifrar('' + Utils.getSession('personal'), 5)
    ).rol;
    //let persona = JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5))
    this.nombreUsu =
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .apellido +
      ' ' +
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .nombre;
  }

  preDelete(item: UsuariosCriminalistica) {
    this.item = new UsuariosCriminalistica();
    this.item = item;

    Swal.fire({
      title: 'Está Seguro?',
      text: '¡Deberá volver a habilitar el usuario si lo necesita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '¡Inhabilitar!',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {

        this.delete();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Utils.showToas('Operacion cancelada', 'warning');
      }
    });
  }

  async delete() {
    try {

      this.procesando = true;
      this.item.baja = true;
      this.item.usuarioBaja = Number(Utils.getSession('user'));
      console.log('usuario', this.item);
      const res = await this.wsdl.doUpdateBaja(this.item.id, this.item).then();
      const result = JSON.parse(JSON.stringify(res));
      if (result.code == 200) {

        Utils.showToas('Usuario inhabilitado correctamente!', 'success');
        this.cancel();
      } else {
        Utils.showToas('Error al inhabilitar el usuario', 'error');
      }
    } catch (error: any) {
      Utils.showToas('Excepción: ' + error.message, 'error');
    }
    this.procesando = false;
  }

  cancel() {
    this.item = new UsuariosCriminalistica();
    this.fil.filter();
  }

  async setResultCancel(event: Boolean) {
    Utils.showToas('Operación cancelada', 'info');
  }

  setResult(event: any) {
    this.cancel();
  }

  evento(event: Boolean) {
    Utils.showToas('Se creo correctamente', 'success');
    this.cerrar.nativeElement.click();
    //this.fil.list();
  }

  // linkear(id?: Number) {
  //   this.router.navigateByUrl(this.entidad + '/abm/' + id);
  // }

  habilitar() {
    this.router.navigateByUrl('/busqueda-usuario/abm');
  }


  doFound(event: UsuariosCriminalistica[]) {
  this.items = event;
  }

  datoVista() {
    let bandera = false;
    if (this.crit != "" && this.crit != undefined) {
      this.items.forEach((element) => {
        if (element.norDni == this.crit) {
          this.crit="";
          bandera = true;
          this.items = [];
          this.items.push(element);
        }
      });
      if(!bandera){
       
      }
    }else {
      this.fil.filter();
    }
  }

  tipoUsuario(item: any) {
    if (item) {
      this.TipoUsuario = 'Personal Policial';
    } else {
      this.TipoUsuario = 'Personal Civil';
    }
    return this.TipoUsuario;
  }

}
