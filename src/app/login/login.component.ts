// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar'; // Para mostrar mensajes
// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   loginForm: FormGroup;
//   isLoading = false;
//   hidePassword = true;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private snackBar: MatSnackBar
//   ) {
//     this.loginForm = this.fb.group({

//       identifier: ['', [Validators.required]],

//     });
//   }

//   ngOnInit(): void {

//      if (this.authService.isLoggedIn()) {
//         this.router.navigate(['/dashboard']);
//      }
//   }

//   async onSubmit(): Promise<void> {
//     if (this.loginForm.invalid) {
//       this.loginForm.markAllAsTouched();
//       return;
//     }

//     this.isLoading = true;
//     const identifier = this.loginForm.value.identifier;


//     try {
//       const loginSuccess = await this.authService.login(identifier);

//       if (loginSuccess) {
//         this.snackBar.open('Login exitoso. Bienvenido!', 'OK', { duration: 3000 });
//         this.router.navigate(['/dashboard']);
//       } else {

//         this.snackBar.open('Login fallido. Verifique sus credenciales.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
//       }
//     } catch (error) {

//         console.error("Error inesperado en onSubmit de Login:", error);
//         this.snackBar.open('Ocurrió un error inesperado durante el login.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
//     } finally {
//         this.isLoading = false;
//     }
//   }
// }


















import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/utils/utils';
import { Cifrado } from 'src/app/utils/cifrado';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
// readonly userName = new FormControl('', [Validators.required, Validators.email]);





  id: number | undefined;

  userName: string ;
  password: string ;

  datosPersonal!: any;

  proccess: boolean;

  item: UsuariosCriminalistica;



  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private wsdlRegistro: RegistroUsuarioService,
    private wsdlUsuarioCentral: UsuarioCriminalisticaService,
    private fb: FormBuilder,

    private router: Router
  ) {
    this.userName = '';
    this.password = '';
    this.proccess = false;
    this.id = 0;
    this.item = new UsuariosCriminalistica();
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  ngOnInit(): void {
    this.userName = '';
    this.password = '';
  }


  async login() {
    try {

      if (this.userName != '' && this.password != '') {

        this.proccess = true;
        let data = await this.wsdlRegistro
          .getLogin(this.userName, this.password)
          .then();
        this.proccess = false;
        const res = JSON.parse(JSON.stringify(data));
        if (res.code == 200) {
          console.log(res,"login1");
          console.log("data login2", res)
         // this.router.navigate(['/dashboard']);
          this.id = res.data;
          console.log("id usuario", this.id)
          this.login2();
        } else if (res.code == 204) {
          this.userName = '';
          this.password = '';
          Swal.fire({
            icon: 'error',
            title: 'Alerta...',
            text: 'Usted no se encuentra registrado en el Sistema RePO',
          });
        } else {
          Swal.fire('Alerta...', res.msg, 'error');
        }
      } else {
        Swal.fire('Alerta...', 'Ingrese datos validos', 'warning');
      }
    } catch (error) {
      this.proccess = false;
      Swal.fire('Oops...', '' + error, 'error');
    }
  }

  async login2() {
    try {
      this.proccess = true;
      let data = await this.wsdlUsuarioCentral.getFindId(this.id).then();
      console.log("login2",data);
      const res = JSON.parse(JSON.stringify(data));
      if (res.code == 200) {

        this.item = res.dato;
        if (!this.item.baja && this.item.activo) {
            this.datosPersonal = {
            apellido: this.item.apellido.toLowerCase(),
            nombre: this.item.nombre.toLowerCase(),
            rol: this.item.rolNavigation?.nombre.toLowerCase(),
            unidad: this.item.sistema,
          };
          //console.log(this.datosPersonal);
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            icon: 'success',
            title: 'Bienvenido Sr/a: ' + this.item.apellido,
          });
          Utils.setSession(
            'user',
            Cifrado.cifrar(JSON.stringify(this.item.id), 5)
          );
          Utils.setSession(
            'personal',
            Cifrado.cifrar(JSON.stringify(this.datosPersonal), 5)
          );
          this.router.navigate(['/dashboard']);
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Alerta...',
            text: 'Usuario dado de baja, contáctese con el administrador del sistema!',
          });
        }
      } else if (res.code == 401) {
        alert(res.code);
        Swal.fire(
          'Usuario no habilitado',
          'Por favor contáctese con el administrador del sistema para generar su usuario',
          'info'
        );
      } else {
        Swal.fire('Oops...', res.msg, 'error');
      }
      this.proccess = false;
    } catch (error) {
      console.log(error);
      Swal.fire('Oops...', 'Algo salio mal vuelva a intentar ', 'error');
      this.proccess = false;
    }
  }
}





