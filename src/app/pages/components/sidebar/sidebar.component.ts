import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsuariosCriminalistica } from 'src/app/models/usuarios-criminalistica';
import { ApiService } from 'src/app/services/api.service';

import { RegistroUsuarioService } from 'src/app/services/registro-usuario.service';
import { UsuarioCriminalisticaService } from 'src/app/services/usuario-criminalistica.service';
import { Cifrado } from 'src/app/utils/cifrado';
import { Utils } from 'src/app/utils/utils';
import { UploadEvidenceDialogComponent } from '../upload-evidence-dialog/upload-evidence-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
@Input() isCollapsed = false;
@Output() menuItemClicked = new EventEmitter<void>(); // Notificar clic

@ViewChild('close')
  cerrar!: ElementRef;

 exportar: boolean = false;
  items: UsuariosCriminalistica[];
  item: UsuariosCriminalistica;



  crit: any;
  procesando!: Boolean;
  public load!: boolean;

  public nombre: string = 'Central Comunicaciones';
  public url: string = 'https://10.125.31.214/central/';
  public activoSistema: boolean = false;

  TipoUsuario!: string;

  entidad = 'lst-usuarios';
  nombreUsu = '';
  rol = 0;

  notifications: any[] = [];
  isLoadingNotifications = false;
private subscriptions = new Subscription();

  constructor(
  private wsdl: UsuarioCriminalisticaService,
    private wsdlRegistro:RegistroUsuarioService,
    private apiService: ApiService,
    private router: Router,
    public dialog: MatDialog
){
 this.load = false;
    this.item = new UsuariosCriminalistica();
    this.items = [];
    this.rol = 0;
}

 ngOnInit(): void {
 this.rol = JSON.parse(
      Cifrado.descifrar('' + Utils.getSession('personal'), 5)
    ).rol,
     //let persona = JSON.parse(Cifrado.descifrar(''+Utils.getSession('personal'),5))
    this.nombreUsu =
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .apellido +
      ' ' +
      JSON.parse(Cifrado.descifrar('' + Utils.getSession('personal'), 5))
        .nombre

    }

loadRecentActivity(): void {
      this.isLoadingNotifications = true;
    const sub = this.apiService.getRecentActivity(10).subscribe({
        next: (data) => {
            this.notifications = Array.isArray(data) ? data : [];
            this.isLoadingNotifications = false;
            console.log("Actividad reciente cargada:", this.notifications);
        },
        error: (err) => {
            this.isLoadingNotifications = false;
            this.notifications = [];
            console.error("Error loading recent activity:", err);

        }
      });
      this.subscriptions.add(sub);
  }





openUploadEvidenceDialog(): void {
        const dialogRef = this.dialog.open(UploadEvidenceDialogComponent, {
          width: '600px',
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === true) {

              this.loadRecentActivity();
          }
        });
    }
}



