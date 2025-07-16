// detalles-via.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detalles-via',
  templateUrl: './detalles-via.component.html',
  styleUrls: ['./detalles-via.component.scss'],
})
export class DetallesViaComponent {
  currentStep = 0;
  @Output() submitForm = new EventEmitter<any>();
   @Input() initialData: any;

  ngOnInit() {
    if (this.initialData) {
      this.viaForm.patchValue(this.initialData);
    }
  }
  viaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.viaForm = this.fb.group({
      zona: this.fb.group({ // Grupo anidado
        centrica: [false],
        poblada: [false],
        despoblada: [false]
      }),
      suelo: this.fb.group({ // Grupo anidado
        asfalto: [false],
        hormigon: [false],
        tierra: [false]
      })
    });
  }

  onFinalSubmit() {
    this.submitForm.emit(this.viaForm.value);
  }
  previousStep() {
    this.currentStep--;
  }
}
