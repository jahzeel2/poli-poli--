import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime } from 'rxjs';
import { Siniestro } from 'src/app/models/siniestro.model';

@Component({
  selector: 'app-lista-siniestros',
  templateUrl: './lista-siniestros.component.html',
  styleUrls: ['./lista-siniestros.component.scss']
})
export class ListaSiniestrosComponent {
  @Output() onEdit = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onPrint = new EventEmitter<number>();


  searchControl = new FormControl('');
  displayedColumns: string[] = ['id', 'fecha', 'lugar', 'tipo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Siniestro>([
    {
      id_siniestro: 1, fechaCreacion: '2024-02-25', lugar: 'Av. Principal 123', tipo: 'Colisión', estado: 'Investigación',
      id_expediente: 0,
      id_hecho: 0,
      id_condiciones: 0,
      id_via: 0,
      id_expe_judicial: 0,
      id_participes: 0,
      fechaModificacion: null,
      fechaBaja: null,
      usuarioCrea: '',
      usuarioModifica: null,
      usuarioBaja: null,
      estadoExpte: 0,
      activo: false
    },
    {
      id_siniestro: 2, fechaCreacion: '2024-02-24', lugar: 'Calle Secundaria 456', tipo: 'Atropello', estado: 'Cerrado',
      id_expediente: 0,
      id_hecho: 0,
      id_condiciones: 0,
      id_via: 0,
      id_expe_judicial: 0,
      id_participes: 0,
      fechaModificacion: null,
      fechaBaja: null,
      usuarioCrea: '',
      usuarioModifica: null,
      usuarioBaja: null,
      estadoExpte: 0,
      activo: false
    }
    // ... más datos de ejemplo
  ]);

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(value => this.applyFilter(value ?? ''));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get filteredData(): Siniestro[] {
    return this.dataSource.filteredData;
  }
}
