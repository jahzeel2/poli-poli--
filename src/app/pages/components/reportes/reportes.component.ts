import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import { finalize, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable'; // <-- 1. IMPORTACIÓN CORREGIDA






@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, OnDestroy {

  filterForm: FormGroup;
  isLoading = false;
  reportGenerated = false; // Para saber si mostrar la tabla y el botón de PDF

  // Tabla de resultados
  displayedColumns: string[] = ['id_expediente', 'fechaHecho', 'lugar', 'tipoHecho', 'primerParticipe', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    // Inicializar formulario de fechas
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filterForm = this.fb.group({
      fechaInicio: [firstDayOfMonth, Validators.required],
      fechaFin: [today, Validators.required]
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Formatear fecha para la API
  private formatDateToAPI(date: Date): string {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  generarReporte(): void {
    if (this.filterForm.invalid) {
      Swal.fire('Fechas Inválidas', 'Seleccione un rango de fechas válido.', 'warning');
      return;
    }
    this.isLoading = true;
    this.reportGenerated = false;

    const { fechaInicio, fechaFin } = this.filterForm.value;

    const sub = this.apiService.getSiniestrosReport(
      this.formatDateToAPI(fechaInicio),
      this.formatDateToAPI(fechaFin)
    )
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.reportGenerated = true;
        if (data.length === 0) {
            Swal.fire('Sin Resultados', 'No se encontraron siniestros para el rango de fechas seleccionado.', 'info');
        }
      },
      error: (err) => {
        console.error("Error generando reporte:", err);
        Swal.fire('Error', `No se pudo generar el reporte: ${err.message}`, 'error');
      }
    });
    this.subscriptions.add(sub);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- Generación de PDF ---
  descargarActa(idSiniestro: number): void {
    Swal.fire({
        title: 'Generando PDF...',
        text: 'Por favor, espere.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // 1. Obtener todos los detalles del siniestro
    this.apiService.getSiniestroById(idSiniestro).subscribe({
        next: (data) => {
            if (data) {
                // 2. Generar el PDF con los datos
                this.generarDocumentoPDF(data);
                Swal.close();
            } else {
                 Swal.fire('Error', 'No se encontraron datos completos para este siniestro.', 'error');
            }
        },
        error: (err) => {
             Swal.fire('Error', `No se pudo obtener la información para el PDF: ${err.message}`, 'error');
        }
    });
  }

  private generarDocumentoPDF(data: any): void {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 15; // Posición vertical inicial

    // --- Encabezado ---
    doc.setFontSize(10);
    doc.text("POLICIA DE LA PROVINCIA DEL CHACO", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 5;
    doc.text("DEPARTAMENTO POLICIA CIENTIFICA", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;

    // --- Título ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("ACTA DE CONSTATACION CRIMINALISTICA EN SINIESTRO VIAL", doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 10;

    // --- Datos del Hecho ---
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const introText = `En la ciudad de Resistencia, capital de la Provincia del Chaco, a los ${new Date(data.fechaHecho).toLocaleDateString('es-AR')} días del mes en curso, siendo las ${data.horaHecho || 'N/D'} hs., el personal de esta División se constituye en ${data.lugarHecho || 'N/D'}...`;
    const splitIntro = doc.splitTextToSize(introText, 180); // Ancho del texto
    doc.text(splitIntro, 15, y);
    y += (splitIntro.length * 6) + 10; // Incrementar Y basado en número de líneas

    // --- Secciones con autoTable ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    // Sección de Partícipes
    if (data.participes && data.participes.length > 0) {
        y = this.checkPageBreak(doc, y);
        doc.text("PARTICIPES", 15, y);
        y += 6;
        (jsPDF as any).autoTable(doc, {
            startY: y,
            head: [['Apellido y Nombre', 'DNI', 'Rol', 'Domicilio']],
            body: data.participes.map((p: any) => [
                `${p.apellido || ''}, ${p.nombre || ''}`,
                p.dni || 'N/D',
                p.tipoUsuario || 'N/D',
                p.domicilio || 'N/D'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
    }

     // Sección de Condiciones
     y = this.checkPageBreak(doc, y);
     doc.text("CONDICIONES DEL LUGAR", 15, y);
     y += 6;
     (jsPDF as any).autoTable(doc, {
        startY: y,
        body: [
            ['Condiciones Climáticas:', data.cond_climaticas || 'N/D'],
            ['Iluminación:', data.iluminacion || 'N/D'],
            ['Visibilidad:', data.visibilidad || 'N/D'],
            ['Tipo de Vía:', data.nombreVia || 'N/D'],
        ],
        theme: 'plain'
     });
     y = (doc as any).lastAutoTable.finalY + 10;

    // --- Firma (Placeholder) ---
    y = this.checkPageBreak(doc, y, 40); // Espacio para firma
    doc.text("Firma del Perito Interviniente:", 15, y);
    y += 20;
    doc.line(15, y, 80, y); // Línea para firmar
    doc.text(`${data.nombrePerito || ''} ${data.apellidoPerito || 'Perito Actuante'}`, 15, y + 5);

    // --- Guardar el documento ---
    doc.save(`Acta_Siniestro_${data.id_expediente}.pdf`);
  }

  // Helper para añadir nueva página si el contenido se sale
  private checkPageBreak(doc: jsPDF, y: number, margin = 20): number {
      const pageHeight = doc.internal.pageSize.height;
      if (y > pageHeight - margin) {
          doc.addPage();
          return 15; // Resetear Y a la posición inicial en la nueva página
      }
      return y;
  }
}

