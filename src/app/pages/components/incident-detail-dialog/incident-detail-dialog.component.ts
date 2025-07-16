import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-incident-detail-dialog',
  templateUrl: './incident-detail-dialog.component.html',
  styleUrls: ['./incident-detail-dialog.component.scss']
})
export class IncidentDetailDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<IncidentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe todos los datos del siniestro
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Helper para formatear claves para mostrar (ej: 'fechaHecho' -> 'Fecha Hecho')
  formatKey(key: string): string {
     if (!key) return '';
     // Separar por mayúsculas y capitalizar primera letra
     return key
        .replace(/([A-Z])/g, ' $1') // Añadir espacio antes de mayúsculas
        .replace(/^id /i, 'ID ') // Corregir 'Id ' a 'ID '
        .replace(/^./, str => str.toUpperCase()); // Capitalizar primera letra
  }

   // Helper para verificar si un valor es una cadena de fecha ISO reconocible
   isISODateString(value: any): boolean {
    if (typeof value !== 'string') return false;
    // Verifica formatos YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss...
    return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[-+]\d{2}:\d{2})?)?$/.test(value);
   }

   // Helper para verificar si un valor es booleano
   isBoolean(value: any): boolean {
       return typeof value === 'boolean';
   }

   // Helper para filtrar claves que no queremos mostrar en la lista principal de detalles
   shouldDisplayKeyInDetailsList(key: string): boolean {
       const excludedKeys = [
           'id', 'id_expediente', 'id_hecho', 'id_condiciones', 'id_via', 'id_expe_judicial', 'estadoExpte', // IDs y estado se muestran arriba
           'firma', 'activo', 'baja', 'fechaBaja', 'usuarioBaja', 'fechaModificacion', 'usuarioModifica', // Auditoría y flags
           'participes', // Se muestra en su propia pestaña/sección
           'fotoSiniestro1', 'fotoSiniestro2', 'fotoSiniestro3', 'fotoSiniestro4', 'fotoSiniestro5', // Se muestran en su pestaña
           'nombreEstado', 'nombreVia', 'nombrePerito', 'apellidoPerito', 'nombreFotografo', 'apellidoFotografo', // Nombres ya usados
           'idPeritoHecho', 'idFotografoHecho' // IDs ya usados
        ];
        // Excluir también si el valor es null o undefined, o si es un objeto (como el array de partícipes)
       return !excludedKeys.includes(key) &&
              this.data[key] !== null &&
              this.data[key] !== undefined &&
              typeof this.data[key] !== 'object';
   }

   // Helper para obtener las claves del objeto data (necesario en el template)
   objectKeys(obj: any): string[] {
       return obj ? Object.keys(obj) : [];
   }

}
