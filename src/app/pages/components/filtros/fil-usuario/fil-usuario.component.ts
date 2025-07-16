import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario_repo } from 'src/app/models/usuario_repo';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';

import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fil-usuario',
  templateUrl: './fil-usuario.component.html',
  styleUrls: ['./fil-usuario.component.scss'],
})
export class FilUsuarioComponent implements OnInit {
  @Output()
  filter: EventEmitter<Usuario_repo> = new EventEmitter<Usuario_repo>();

  cargando: Boolean = false;
  procesando: Boolean;
  public search!: string;
  public crit = '';
  public id: any;
  public result: any;
  public rol: any;
  public nombre: string = 'Criminalistica';
  public url: string = 'http://10.125.30.245/api/';
  public activoSistema: boolean = true;

  item: UsuariosCriminalistica;

  constructor(
    private route: Router,
    private wsdl: RegistroUsuarioService,
    private wsdlUsuariosCriminalistica: UsuarioCriminalisticaService
  ) {
    this.procesando = false;
    this.cargando = false;
    this.item = new UsuariosCriminalistica();
  }

  ngOnInit() {}

  public async list() {
    try {
      this.cargando = true;
      this.procesando = true;
      if (this.search != undefined || this.search != '') {
        this.crit = this.search;
      }
      let data = await this.wsdl.doFindDni(this.crit).then();
      console.log("registro de usuario",data);
      this.result = JSON.parse(JSON.stringify(data));
      console.log('que es', this.result);
      //alert("aca estpy")

      if (this.result.code == 200) {
        console.log("soy el error",this.result)
        this.id = this.result.data.id;
        console.log("usuario",this.id);
        this.verificarUsuario();
      } else if (this.result.code == 204) {
        Swal.fire({
          title: 'El usuario no existe!',
          text: 'Si el usuario que está por habilitrar es Personal Policial, por favor comuniquece con el área de Sistemas!, pero si el usuario es Personal Civil, puede crearlo. Al presionar el botón crear, le redirigira al formulario para su creación, pero si ya fue creado debera registrarse en el sistema REPO',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Crear!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.route.navigate(['/lst-usuarios/abm/0']);
          }
        });
      } else if (this.result.code == 205) {
        this.search = '';
        Swal.fire({
          title: 'El usuario no existe!',
          text: 'Deberá registrarse en el sistema REPO',
          icon: 'warning',
        });
      } else {
        this.filter.emit();
        this.procesando = false;
        this.cargando = false;
        Utils.showToas(this.result.msg, 'error');
      }
    } catch (error) {
      this.procesando = false;
      this.cargando = false;
      Utils.showToas('Error', 'error');
    } finally {
      this.procesando = false;
      this.cargando = false;
    }
  }

  async verificarUsuario() {
    let data1 = await this.wsdlUsuariosCriminalistica.getFindId(this.id).then();
    console.log('llegue aa verificar usuario', data1);
    const result1 = JSON.parse(JSON.stringify(data1));
    console.log("resultado de la consulta",result1);
    if (result1.code == 200) {
      this.item = result1.dato;
      console.log('this.item', this.item);
      if (this.item.baja) {
        Swal.fire({
          title: 'El usuario se encuentra dado de baja',
          text: 'DESEA HABILITARLO!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            this.editBaja();
          }
        });
      } else {
        this.search = '';
        Swal.fire({
          title: 'El usuario ya se encuentra habilitado!',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
      }
    } else if (result1.code == 401) {
      this.filter.emit(this.result.data);
      this.cargando = false;
      this.procesando = false;
    }
  }

  async editBaja() {
    //fecha y id de quien da de baja
    this.item.usuarioRepo = Number(Utils.getSession('user'));
    this.item.baja = false;
    let data2 = await this.wsdlUsuariosCriminalistica
      .doUpdateBaja(this.item.id, this.item)
      .then();
    const result2 = JSON.parse(JSON.stringify(data2));
    if (result2.code == 200) {
      try {
        let data = await this.wsdl
          .patchSistemaHabilitados(
            this.item.usuarioRepo,
            this.nombre,
            this.url,
            this.activoSistema
          )
          .then();
        let res = JSON.parse(JSON.stringify(data));
        if (res.code == 200) {
          console.log('Personal Habilitado');
        }
      } catch (error) {
        //console.log("respuestaerror", error);
      }
      Swal.fire(
        'Operación Exitosa!',
        'El usuario ha sido habilitado correctamente!',
        'success'
      );
      this.back();
    }
  }

  back() {
    this.route.navigate(['/lst-usuarios']);
  }
}
