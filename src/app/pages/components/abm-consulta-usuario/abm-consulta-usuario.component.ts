import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Rol } from 'src/app/models/rol.model';
import { Usuario_repo } from 'src/app/models/usuario_repo';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';




import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';

import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';


import { Cifrado } from 'src/app/utils/cifrado';

import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-consulta-usuario',
  templateUrl: './abm-consulta-usuario.component.html',
  styleUrls: ['./abm-consulta-usuario.component.scss'],
})
export class AbmConsultaUsuarioComponent implements OnInit {
  form!: FormGroup;

  item: Usuario_repo;
  dtCriminalistica!: UsuariosCriminalistica;
  proceso: Boolean;
  //tipoPersona: string;
  rol: boolean;

  public nombre: string = 'DEPARTAMENTO CRIMINALISTICA';
  public url: string = 'http://10.125.30.245/api/';
  public activo: boolean = true;

  constructor(
    private route: Router,
    private wsdl:UsuarioCriminalisticaService,
    private wsdlRegistro: RegistroUsuarioService
  ) {
    this.item = new Usuario_repo();
    this.dtCriminalistica = new UsuariosCriminalistica();
    //this.tipoPersona = '';
    this.proceso = false;
    this.rol = false;
  }

  ngOnInit(): void {}

  public async insertCrimin() {

    this.dtCriminalistica.sistema = Number(JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5)).unidad);
    console.log(this.dtCriminalistica.sistema,"lezca",);
    //this.dtCentral.userCreaRepo = 1;
    this.dtCriminalistica.userCreaRepo = Utils.getSession('user');

    this.dtCriminalistica.fechaAlta = moment(this.dtCriminalistica.fechaAlta).format('YYYY-MM-DD');
    console.log("datos guardados", this.dtCriminalistica)
    try {
      let data = await this.wsdl.doInsert(this.dtCriminalistica).then();
      console.log('data', data);
      let res = JSON.parse(JSON.stringify(data));
      console.log('res', res);
      if (res.code == 200) {
        try {
          let data = await this.wsdlRegistro
            .patchSistemaHabilitados(
              this.dtCriminalistica.usuarioRepo,
              this.nombre,
              this.url,
              this.activo
            )
            .then();
        } catch (error) {}
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Usuario habilitado correctamente!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.back();
      } else {
      }
    } catch (error) {}
  }

  pregunta() {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Usted está por habilitar un nuevo usuario!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.insertCrimin();
      }
    });
  }

  doFound(event: Usuario_repo) {
    console.log('Event', event);
    this.proceso = true;

    if (event.civil != null) {

      this.dtCriminalistica.tipoPersona = false;
      this.dtCriminalistica.civil = event.civil.id;
      this.dtCriminalistica.nombre = event.civil.nombre;
      this.dtCriminalistica.apellido = event.civil.apellido;
      this.dtCriminalistica.norDni = event.civil.norDni;
      this.dtCriminalistica.usuarioRepo = event.id;
      this.dtCriminalistica.rol = event.rol;
      this.dtCriminalistica.rolNombre = event.rol.nombre;

    }

    if (event.persona != null) {
      this.dtCriminalistica.tipoPersona = true;
      this.dtCriminalistica.persona = event.persona.id;
      this.dtCriminalistica.nombre = event.persona.nombre;
      this.dtCriminalistica.apellido = event.persona.apellido;
      this.dtCriminalistica.norDni = event.persona.norDni;
      this.dtCriminalistica.usuarioRepo = event.id;
      this.dtCriminalistica.rol = event.rol;
      this.dtCriminalistica.rolNombre = event.rol.nombre;

    }
  }

  seleccionRol(event: Rol) {
    if (event != undefined) {
      alert(event.id)
      this.dtCriminalistica.rol = event;
  };
  }


  valor(item: any) {
    let dato: string = '';
    if (item) {
      dato = 'Personal Policial';
    } else {
      dato = 'Personal Administrativo';
    }
    return dato;
  }

  back() {
    this.route.navigate(['lst-usuarios']);
  }
}
