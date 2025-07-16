import { HttpHeaders } from "@angular/common/http";
import * as moment from "moment";
import Swal, { SweetAlertIcon } from "sweetalert2";

export class Utils {
    public static US = '';
    public static TK = '';
  

    public static fecha(f:any){

      return moment(f).format('YYYY-MM-DD');
    }

    public static setSession(key: string, data: string) {
      sessionStorage.setItem('estaLogueado', '1');
      sessionStorage.setItem(key, data);
    }
  
    public static getSession(key: any) {
      return sessionStorage.getItem(key);
    }
  
    public static getToken() {
      return localStorage.getItem('loginAuth');
    }
  
    public static setToken(token: any) {
      localStorage.setItem('loginAuth', token);
    }
  
    public static clearSession() {
      sessionStorage.clear();
      /*
          for (let i = 0; i < localStorage.length; i++) {
            let key = this.loc.key(i);
            let value = this.loc.getItem(key);
            console.log(key, value);
          }
          */
    }
  
    public static getHeader() {
      let uid;
      try {
        uid = JSON.parse('' + localStorage.getItem(this.US)).token;
      } catch (error) {
        uid = '';
      }
  
      if (uid == undefined) {
        uid = '';
      }
  
      const header = new HttpHeaders({
        uid: uid,
        Authorization: '' + localStorage.getItem(this.TK),
      });
  
      return header;
    }
  
    public static showToas(msg: String, type: SweetAlertIcon) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
  
      Toast.fire({
        icon: type,
        title: msg,
      });
    }
  
    static devolucionTE(valor: string) {
      let d = '';
      switch (valor) {
        case 'PP':
          d = 'PRESTAMO PROVISORIO';
          break;
        case 'PC':
          d = 'PROVISION CON CARGO';
          break;
        case 'SE':
          d = 'ORDEN DE SERVICIO EXTERNO';
          break;
        case 'RE':
          d = 'ENTREGA POR RELEVAMIENTO';
          break;
      }
      return d;
    }
    static exportTableToExcel(tableID: any, filename = '') {
      return new Promise((resolve) => {
        var downloadLink;
        var dataType = 'application/vnd.ms-excel';
        var navigator: any;
  
        var tableSelect: any = document.getElementById(tableID);
        console.log(tableSelect);
        var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
        // Specify file name
        filename = filename ? filename + '.xlsx' : 'excel_data.xlsx';
  
        // Create download link element
        downloadLink = document.createElement('a');
  
        document.body.appendChild(downloadLink);
  
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
        // Setting the file name
        downloadLink.download = filename;
  
        //triggering the function
        downloadLink.click();
        resolve(true);
      });
    }
    static delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  
    public static autenticacion() {
      try {
        return parseInt(sessionStorage.getItem('estaLogueado')!) == 1;
      } catch (error) {
        return false;
      }
    }
}
