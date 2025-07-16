import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-siniestros',
  templateUrl: './siniestros.component.html',
  styleUrls: ['./siniestros.component.scss']
})
export class SiniestrosComponent {
  @Output() nextStep = new EventEmitter<any>();
  @Input() initialData: any;

ngOnInit() {
  if (this.initialData) {
    this.siniestroForm.patchValue(this.initialData);
  }
}
  siniestroForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.siniestroForm = this.fb.group({
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      numeroIntervencion: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      lugar: ['', [Validators.required]],
      coordenadas: ['', [Validators.pattern(/^[+]{0,1}\d{1,15}[.]{0,1}\d{0,15}$/)]], // Validación básica coordenadas
      localidad: ['', [Validators.required]],
      escribiente: ['', [Validators.required]]
    });
  }

  // Helper para acceder fácil a los controles
  get f() {
    return this.siniestroForm.controls;
  }

  onSubmit() {
    if (this.siniestroForm.valid) {
      this.nextStep.emit(this.siniestroForm.value);
    } else {
      this.markFormGroupTouched(this.siniestroForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
