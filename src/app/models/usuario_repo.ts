

import { Civil } from "./civil";
import { Persona } from "./persona";
import { Rol } from "./rol.model";


export class Usuario_repo {
    id!: number; /**id del usuario en repo */
    usuario!: String;/**nombre del usuario */
    persona: Persona;
    civil: Civil;
    rol: Rol;

    constructor() {
        this.rol = new Rol();
        this.persona = new Persona();
        this.civil = new Civil();
    }

}
