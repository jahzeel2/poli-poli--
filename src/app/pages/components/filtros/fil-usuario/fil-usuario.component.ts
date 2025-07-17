import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario_repo } from 'src/app/models/usuario_repo';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import { FormsModule } from '@angular/forms';

import { Utils } from 'src/app/utils/utils';

import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fil-usuario',
  templateUrl: './fil-usuario.component.html',
  styleUrls: ['./fil-usuario.component.scss'],
})
export class FilUsuarioComponent implements OnInit {
  @Output() filter = new EventEmitter<Usuario_repo>();

  search: string = '';
  isLoading: boolean = false;

  constructor(private wsdl: RegistroUsuarioService) {}

  ngOnInit(): void {}

  async doFound() {
    if (!this.search || this.search.trim() === '') {
      Swal.fire('Atención', 'Debe ingresar un DNI para buscar', 'warning');
      return;
    }

    this.isLoading = true;
    try {
      const data = await lastValueFrom(this.wsdl.doFound(this.search));
      const result = JSON.parse(JSON.stringify(data));

      if (result && result.code === 200) {
        this.filter.emit(result.data as Usuario_repo); // Emitir el objeto de usuario
      } else {
        Swal.fire('No encontrado', result.msg, 'error');
        this.filter.emit(new Usuario_repo()); // Emitir un objeto vacío
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al buscar el usuario', 'error');
      this.filter.emit(new Usuario_repo());
    } finally {
      this.isLoading = false;
    }
  }
}
