export interface Siniestro {
  id_siniestro : number;
  id_expediente: number;
  id_hecho: number;
  id_condiciones: number;
  id_via: number;
  id_expe_judicial: number;
  id_participes: number;
  fechaCreacion: string;
  fechaModificacion: Date | null;
  fechaBaja: Date | null;
  usuarioCrea: string;
  usuarioModifica: string | null;
  usuarioBaja: string | null;
  estadoExpte: number;
  activo:boolean;
  lugar: string;
  tipo: string;
  estado:string;
}
