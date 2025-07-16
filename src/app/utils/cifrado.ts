export class Cifrado {

    private static abc: string = "aábcdeéfghiíjklmnñoópqrstuúüvwxyz0123456789";
    //   private static llave: number = 17;



    public static cifrar(mensaje: string, desplazamiento: number): string {
        let cifrado: string = "";
        if (desplazamiento > 0 && desplazamiento < this.abc.length) {
            //recorre caracter a caracter el mensaje a cifrar
            for (let i = 0; i < mensaje.length; i++) {
                let posCaracter: number = this.getPosABC(mensaje[i]);
                if (posCaracter != -1) //el caracter existe en la variable abc
                {
                    let pos: number = posCaracter + desplazamiento;
                    //solo entra al bucle si pos es mayor o igual a abc y resta para tomar la posicion
                    while (pos >= this.abc.length) {
                        pos = pos - this.abc.length;

                    }
                    //concatena al mensaje cifrado 
                    cifrado += this.abc[pos];
                }
                else//si no existe el caracter no se cifra

                {
                    cifrado += mensaje[i];
                }
            }

        }
        return cifrado;
    }

    /* 
    * El descifrado  es el procedimiento inverso 
   */
    public static descifrar(mensaje: string, desplazamiento: number): string {
        let descifrado: string = "";
        if (desplazamiento > 0 && desplazamiento < this.abc.length) {
            for (let i = 0; i < mensaje.length; i++) {
                let posCaracter: number = this.getPosABC(mensaje[i]);
                if (posCaracter != -1) //el caracter existe en la variable abc
                {
                    let pos: number = posCaracter - desplazamiento;
                    //solo entra al bucle se pos es un numero negativo

                    while (pos < 0) {
                        pos = pos + this.abc.length;

                    }
                    descifrado += this.abc[pos];
                }
                else {
                    //sino existe agrego sin cifrar
                    descifrado += mensaje[i];
                }
            }

        }
        return descifrado;
    }

    /* obtiene la posicion del caracter pasado como parametro 
     * en la variable abc que es nuestro abecedario de cifrado/descifrado
    */
    private static getPosABC(caracter: string): number {
        for (let i = 0; i < this.abc.length; i++) {
            if (caracter == this.abc[i]) {
                //retorna el numero de posicion
                return i;
            }
        }
        return -1;// si retorna este valor es porque no esta en el abc y se deja como esta el caracter
    }



}