import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';


import Swal from 'sweetalert2';

import { Utils } from 'src/app/utils/utils';
import { Cifrado } from 'src/app/utils/cifrado';
import * as moment from 'moment';
import { FliPeritosCrimComponent } from '../../filtros/fli-peritos-crim/fli-peritos-crim.component';
import { Perito } from 'src/app/models/perito.model';
import { PeritosService } from 'src/app/services/peritos.service';

@Component({
  selector: 'app-lst-peritos',
  templateUrl: './lst-peritos.component.html',
  styleUrls: ['./lst-peritos.component.scss'],
})
export class LstPeritosComponent {
  @ViewChild(FliPeritosCrimComponent, { static: false })
  fil!: FliPeritosCrimComponent;
  items: Perito[];
  item: Perito;
  id_usuer!: number;
  nombreUsu: any;
  rol!: number;

  constructor(private wsld: PeritosService, private router: Router) {
    this.items = [];
    this.item = new Perito();
  }
  ngOnInit(): void {
    this.rol = JSON.parse('' + Utils.getSession('personal')).rol;
    this.nombreUsu = JSON.parse('' + Utils.getSession('personal')).nombre;
  }

  DoFound(event: Perito[]) {
    this.items = event;
    console.log("elitem",this.items);
  }

  linkear(id?: Number) {
    this.router.navigateByUrl('lst-estados/abm/' + id);
  }

  retroseder() {
    this.router.navigate(['']);
  }

  volver_al_abm(id: number) {
    this.router.navigate([`/lst-peritos/abm/${id}`]);
  }

  eliminardato(id: any) {
    try {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: 'Estás seguro?',
          text: 'El registro no se podra recuperar!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar!',
          cancelButtonText: 'Cancelar!',
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            this.item.usuarioBaja = Number(Cifrado.descifrar(String(Utils.getSession('user')), 5))
            this.item.fechaBaja = Utils.fecha(this.item.fechaBaja);
            console.log("usuario baja",this.item.usuarioBaja)
            let data = this.wsld.doDetele(id, this.item.usuarioBaja);
            console.log("respuesta",data)
            const resultado = await lastValueFrom(data);
            console.log("resultado", resultado)
            const result = JSON.parse(JSON.stringify(resultado));
            if (result.code == 200) {
              this.fil.filter();
              swalWithBootstrapButtons.fire(
                'Eliminado exitosamente!',
                'Tu registro ya no existe.',
                'success'
              );
            }
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire(
              'Cancelado',
              'Su registro está seguro :)',
              'error'
            );
          }
        });
    } catch {}
  }

  volver_principal() {
    this.router.navigate(['/principal2']);
  }

  fecha(f: any) {
    return moment(f).format('YYYY-MM-DD');
  }
}


