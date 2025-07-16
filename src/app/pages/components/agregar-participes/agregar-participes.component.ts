import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Participe {
  tipo: string;
  marca: string;
  modelo: string;
  dominio: string;
  motor: string;
  color: string;
  ocupantes: number;
  acoplado: boolean;
  circulabaPor: string;
  desde: string;
  hacia: string;
  luces: boolean;
  espejos: boolean;
  frenos: boolean;
  casco: boolean;
  danos: string;
}




@Component({
  selector: 'app-agregar-participes',
  templateUrl: './agregar-participes.component.html',
  styleUrls: ['./agregar-participes.component.scss']
})
export class AgregarParticipesComponent {
  @Input() initialData: any;
  @Output() participeGuardado = new EventEmitter<Participe>();
  participeForm: FormGroup;
  participantes: Participe[] = [];

  constructor(private fb: FormBuilder) {
    this.participeForm = this.fb.group({
      tipo: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      // dominio: ['', [Validators.required, Validators.pattern('[A-Z]{2,3}[0-9]{3,4}')]],
      motor: ['', Validators.required],
      color: ['', Validators.required],
      ocupantes: [1, [Validators.required, Validators.min(1)]],
      acoplado: [false],
      circulabaPor: ['', Validators.required],
      desde: ['', Validators.required],
      hacia: ['', Validators.required],
      luces: [false],
      espejos: [false],
      frenos: [false],
      casco: [false],
      danos: ['', Validators.required]
    });
  }

  guardarTemporalmente() {
    if(this.participeForm.valid) {
      this.participeGuardado.emit(this.participeForm.value);
    }
  }

  agregarOtro() {
    if(this.participeForm.valid) {
      this.participantes.push(this.participeForm.value);
      this.participeForm.reset({
        ocupantes: 1,
        acoplado: false,
        luces: false,
        espejos: false,
        frenos: false,
        casco: false
      });
    }
  }
}



