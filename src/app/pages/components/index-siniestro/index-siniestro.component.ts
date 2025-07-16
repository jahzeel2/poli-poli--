import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Participe } from 'src/app/models/participe.model';

@Component({
  selector: 'app-index-siniestro',
  templateUrl: './index-siniestro.component.html',
  styleUrls: ['./index-siniestro.component.scss']
})
export class IndexSiniestroComponent implements OnInit, OnDestroy {
  currentStep = 1;
  siniestroData: any = {};
  totalSteps = 4; // Total de pasos en tu flujo

  ngOnInit() {


    // Cargar datos al inicializar
    const savedData = localStorage.getItem('siniestroDraft');
    if (savedData) {
      const { step, data } = JSON.parse(savedData);
      this.currentStep = step;
      this.siniestroData = data;
    }
  }
  onParticipeGuardado(participe: Participe) {
    // Lógica para guardar en array temporal o enviar a API
  }


  // Guardar automáticamente en cada cambio
  autoSave() {
    localStorage.setItem('siniestroDraft', JSON.stringify({
      step: this.currentStep,
      data: this.siniestroData
    }));
  }


  handleNextStep(data: any) {
    this.siniestroData = { ...this.siniestroData, ...data };
    this.currentStep++;
    this.autoSave();
  }

  // Limpiar al finalizar o destruir componente
  finalizarProceso() {
    localStorage.removeItem('siniestroDraft');
    // Lógica de envío final...
  }



  ngOnDestroy() {
    if (this.currentStep !== this.totalSteps) {
      this.autoSave(); // Guardar si el usuario abandona
    }
  }


  previousStep(){
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

}








