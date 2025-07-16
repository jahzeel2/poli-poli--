export interface Usuario {
  id_usuario: number;
  idRol: number;
  userCreaRepo: string;
  usuarioRepo: string;
  fechaAlta: Date;
  persona: string;
  civil: string;
  nroDni: string;
  nombre: string;
  apellido: string;
  activo: boolean;
}
