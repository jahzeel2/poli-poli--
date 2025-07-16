export interface Vehiculo {
  id_vehiculos: number;
  tipo: string;
  dominio: string;
  color: string;
  marca: string;
  nroMotor: string;
  cantidadOcupantes: number;
  acoplado: boolean;
  circulabaPor: string;
  desde: string;
  hacia: string;
  luces: boolean;
  espejos: boolean;
  frenos: boolean;
  casco: boolean;
  descripcionDeDanos: string;
  activo:boolean;
}
