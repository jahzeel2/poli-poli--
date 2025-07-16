import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-evidence-dialog',
  templateUrl: './upload-evidence-dialog.component.html',
  styleUrls: ['./upload-evidence-dialog.component.scss']
})
export class UploadEvidenceDialogComponent implements OnInit {

  @ViewChild('stepper') stepper!: MatStepper;

  findIncidentForm: FormGroup;
  uploadPhotosForm: FormGroup; // Aún necesario para el control del paso

  incidentId: number | null = null;
  incidentFound = false;
  isLoading = false;
  // uploadProgress = 0; // Ya no se usa si no hay reporte de progreso
  selectedFiles: { file: File, preview: string | ArrayBuffer | null }[] = [];
  readonly MAX_FILES = 4; // Mantener límite visual

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<UploadEvidenceDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.findIncidentForm = this.fb.group({
      expedienteId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
    this.uploadPhotosForm = this.fb.group({}); // Vacío está bien
  }

  ngOnInit(): void { }

  findIncident(): void {
    if (this.findIncidentForm.invalid) { this.findIncidentForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.incidentId = this.findIncidentForm.value.expedienteId;
    this.findIncidentForm.get('expedienteId')?.setErrors(null);

    this.apiService.getSiniestroById(this.incidentId!).pipe(
        finalize(() => this.isLoading = false)
    ).subscribe({
      next: (siniestroData) => {
        if (siniestroData && typeof siniestroData === 'object') {
          this.incidentFound = true;
          this.snackBar.open(`Expediente #${this.incidentId} encontrado.`, 'OK', { duration: 3000 });
          this.stepper.next();
        } else { this.handleIncidentNotFound(); }
      },
      error: (err) => { this.handleIncidentNotFound(err); }
    });
  }

  handleIncidentNotFound(error?: any): void {
     this.isLoading = false; this.incidentFound = false; this.incidentId = null;
     const message = error?.status === 404 ? 'Expediente no encontrado.' : 'Error al buscar.';
     console.error("Error finding incident:", error);
     this.snackBar.open(message, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
     this.findIncidentForm.get('expedienteId')?.setErrors({'notFound': true});
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
       const filesToAdd = Array.from(input.files);
       const availableSlots = this.MAX_FILES - this.selectedFiles.length;
       if (filesToAdd.length > availableSlots) {
           this.snackBar.open(`Solo puede subir ${this.MAX_FILES} fotos. Se seleccionaron ${availableSlots}.`, 'OK', { duration: 4000 });
           filesToAdd.splice(availableSlots);
       }
       filesToAdd.forEach(file => {
         if (!file.type.startsWith('image/')) {
             this.snackBar.open(`Archivo '${file.name}' no es una imagen.`, 'OK', { duration: 3000 });
             return;
         }
         const reader = new FileReader();
         reader.onload = (e) => {
           // Guardar el resultado (Data URL Base64) en preview
           this.selectedFiles.push({ file: file, preview: e.target?.result || null });
         };
         reader.readAsDataURL(file);
       });
       input.value = '';
    }
  }

  removeSelectedFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  // --- MÉTODO MODIFICADO: Enviar Base64 ---
  uploadFiles(): void {
    if (this.selectedFiles.length === 0 || !this.incidentId) {
      this.snackBar.open('Debe seleccionar fotos y haber encontrado un expediente.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    // this.uploadProgress = 0; // Ya no aplica

    // Crear el objeto payload con las Base64
    const payload: { [key: string]: string | null } = {};
    this.selectedFiles.forEach((fileData, index) => {
        if (fileData.preview && typeof fileData.preview === 'string') {
             // Asegurarse que preview sea string (Data URL Base64)
            payload[`foto${index + 1}`] = fileData.preview;
        } else {
             payload[`foto${index + 1}`] = null; // O manejar error si preview es inválido
        }
    });

    // Asegurar que se envíen nulls para las fotos no subidas si el backend lo necesita
    // for (let i = this.selectedFiles.length + 1; i <= this.MAX_FILES; i++) {
    //      payload[`foto${i}`] = null; // Opcional: enviar null para borrar existentes?
    // }

    console.log("Enviando payload Base64:", payload);

    // Llamar al servicio API modificado
    this.apiService.saveSiniestroFotosBase64(this.incidentId, payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          Swal.fire('¡Éxito!', response?.message || 'Fotos guardadas correctamente.', 'success');
          this.dialogRef.close(true); // Cerrar diálogo indicando éxito
        },
        error: (err) => {
          console.error("Error saving base64 photos:", err);
          Swal.fire('Error', `No se pudieron guardar las fotos: ${err.message}`, 'error');
        }
      });
  }
  // --- FIN MÉTODO MODIFICADO ---

  closeDialog(): void {
    this.dialogRef.close();
  }
}
