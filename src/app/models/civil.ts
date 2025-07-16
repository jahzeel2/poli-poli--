
export class Civil {

    id!: number;
    // sexo!: Sexo;
    usuarioCrea!: any;
    apellido!: string;
    nombre!: string;
    norDni!: number;
    grupoS!: string;
    factor!: string;
    fechaNacimiento!: any;
    domicilio!: any;
    fechaFinContrato!: any;
    // unidad!: Unidad;
    activo!: boolean;
    created_at?: any;
    updated_at?: any;
    deleted_at?: any;

    constructor() {
        // this.sexo = new Sexo();
        // this.unidad = new Unidad();
        this.activo = true;

    }
}