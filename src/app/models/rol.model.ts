export class Rol {
    id!: number;
    nombre!: string;
    activo: boolean;

    constructor(){
        this.activo = true;
        this.nombre = '';
        this.id = 0;
    }
}
