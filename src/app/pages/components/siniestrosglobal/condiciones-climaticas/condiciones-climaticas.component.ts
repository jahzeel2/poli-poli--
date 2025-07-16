// condiciones-climaticas.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({

  selector: 'app-condiciones-climaticas',
  templateUrl: './condiciones-climaticas.component.html',

})
export class CondicionesClimaticasComponent {
  @Output() previousStepEvent = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<any>();
  @Input() initialData: any;
  siniestroData: any = {};
ngOnInit() {
  if (this.initialData) {
    this.condicionesForm.patchValue(this.initialData);
  }
}
  condicionesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.condicionesForm = this.fb.group({
      // Primera Fila
      dia: [false],
      noche: [false],
      iluminacionArtificial: [false],
      // Segunda Fila
      despejado: [false],
      lluvia: [false],
      humo: [false],
      // Tercera Fila
      nublado: [false],
      granizo: [false],
      seco: [false],
      // Cuarta Fila
      humedo: [false],
      viento: [false],
      mojado: [false],
      otros: ['']
    });
  }
  goBack() {
    this.previousStepEvent.emit();
  }


  onSubmit() {
    if (this.condicionesForm.valid) {
      this.nextStep.emit(this.condicionesForm.value);
    }
  }
}
