export interface Hecho {
  id_hecho: number;
  fecha: Date;
  lugar: string;
  hora: string;
  coord: string;
  tipo: string;
  escribiente: string;
  peritoInterviniente: number;
  fotografo: number;
  activo: boolean;
}
