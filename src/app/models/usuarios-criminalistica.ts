export class UsuariosCriminalistica {
    
    id!: number;
    userCreaRepo!: any; //usuario que crea el usuario
    usuarioRepo: any;//el usuario creado
    fechaAlta: any;
    persona!: number;
    civil!: number;
    norDni: any;
    nombre!: string; //| undefined
    apellido!: string; //| undefined
    tipoPersona!: boolean; /*TRUE POLICIA   FALSE CIVIL*/
    fechaBaja: any;
    usuarioBaja: any;
    baja: boolean; /**baja de usuario del sistema por defecto false */
    activo: boolean; /**para que el usuario desactive temporalmente su usuario desde el repo */
    sistema!: number; /*id de unidad*/
    cifrado: any; /*PARA INGRESAR DESDE EL REPO*/
    fechaVinculacion: any; /*fecha de control para el ingreso*/
    rol!: number;
  
    rolNombre!: string; //| undefined
    rolNavigation: any;
    unidadSistemaNavigation: any;
    
    constructor() {
      this.baja = false;
      this.activo = true;
    }
}
