export class Perito {
  idPerito: number;
  nombre: string;
  apellido: string;
  dni: number;
  tipoPersona: string;
  idPersonalPolicial: number;
  tipoPerito: string;
  fechaAlta: Date;
  usuarioAlta: number;
  fechaBaja: string;
  usuarioBaja: number;
  unidadCreacion: number;
  idPersonalCivil: number;
  activo: boolean;


constructor() {
  this.activo = true;
  this.idPerito = 0;
  this.nombre = '';
  this.apellido = '';
  this.dni = 0;
  this.tipoPersona = '';
  this.idPersonalPolicial = 0;
  this.tipoPerito = '';
  this.fechaAlta = new Date();
  this.usuarioAlta = 0;
  this.fechaBaja = '';
  this.usuarioBaja = 0;
  this.unidadCreacion = 0;
  this.idPersonalCivil = 0;

  
}

}
