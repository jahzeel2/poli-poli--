import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Perito } from 'src/app/models/perito.model';
import { Usuario_repo } from 'src/app/models/usuario_repo';
import { HabilitarperitosService } from 'src/app/services/habilitarperitos.service';
import { PeritosService } from 'src/app/services/peritos.service';



import { Cifrado } from 'src/app/utils/cifrado';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abm-perito',
  templateUrl: './abm-perito.component.html',
  styleUrls: ['./abm-perito.component.scss']
})
export class AbmPeritoComponent {
public id!: number;
form!: FormGroup;

//variable para verificar que fue enviado los datos
enviado = false;
id_usuer!:number;
id_unidad!:number
item: Perito;
vista:boolean

  constructor(
    private Route: ActivatedRoute,
    private router: Router,
    private wsdl: PeritosService,
    private registrousuario: HabilitarperitosService ,
    private formBuilder: FormBuilder
  ) {
    this.item = new Perito();
    this.vista=false
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        DNI: ['', Validators.required],
        tipoPersona: ['', Validators.required],
        tipoPerito: ['', Validators.required],
    });

    this.id_usuer =
    JSON.parse(Cifrado.descifrar('' + Utils.getSession('user'), 5))
    this.id_unidad =
    JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
    .unidad



    this.id = this.Route.snapshot.params['id'];
    this.findId();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  doAction() {
    this.enviado = true;
    if (this.form.valid) {
      if (this.id > 0) {
        this.actualizarDatos(this.item);
      } else {
        this.guardar();
      }
    } else {

      this.guardar();
    }
  }
  async findId() {
    try {
      const consulta = this.wsdl.getFindId(this.id);
      const date = await firstValueFrom(consulta);
      const result = JSON.parse(JSON.stringify(date));
      if (result.code == '200') {
        this.item = result.dato;

      }
    } catch (error) {}
  }
  async actualizarDatos(obj: Perito) {
    try {
      const modificacion = this.wsdl.update(this.id, this.item);
      let data = await lastValueFrom(modificacion);
      const result = JSON.parse(JSON.stringify(data));
      if (result.code == 200) {
        this.back();
        Swal.fire({
          icon: 'success',
          title: 'Exelente',
          text: 'dato modificado correctamente',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ALERTA...',
        text: 'No se pudo insertar los datos',
      });
    }
  }

  async guardar() {
    try {
      //  this.item.activo = true;
      //  this.item.nombre = "true";

      // const insersion = this.wsdl.create(this.item);
      //  let data = await lastValueFrom(insersion);

      this.item.usuarioAlta = this.id_usuer
      this.item.unidadCreacion = this.id_unidad
      let data = await this.wsdl.create(this.item);
      let dat = await lastValueFrom(data);
      // console.log(dat);
      const result = JSON.parse(JSON.stringify(dat));
      // console.log(result);
      if (result.code == 200) {
        this.back();
        Swal.fire({
          icon: 'success',
          title: 'Exelente',
          text: 'dato creado correctamente',
        });
      } else if (result.code == 204) {
        Swal.fire({
          icon: 'info',
          title: 'ALERTA...',
          text: 'El dato ya existe en la base de datos',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ALERTA...',
        text: 'No se pudo insertar los datos',
      });
    }
  }

emitir(usuario_repo:Usuario_repo) {
  this.vista=true
 // usuario_repo=new Usuario_repo()
this.item= new Perito();
  console.log(usuario_repo)
  this.item.nombre=usuario_repo.persona.nombre;
  this.item.apellido=usuario_repo.persona.apellido;
  this.item.dni=parseInt(usuario_repo.persona.norDni);
}




back() {
this.router.navigate(['/lst-peritos']);
}

}
