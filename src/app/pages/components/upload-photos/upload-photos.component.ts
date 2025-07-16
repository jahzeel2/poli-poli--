import { Component, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  ElementRef, QueryList } from '@angular/core';
interface FileBase64 {
  name: string;
  type: string;
  size: number;
  base64: string;
}

@Component({
  selector: 'app-upload-photos',
  templateUrl: './upload-photos.component.html',
  styleUrls: ['./upload-photos.component.scss']
})

export class UploadPhotosComponent {

  @Output() nextStep = new EventEmitter<{
    foto1?: string;
    foto2?: string;
    foto3?: string;
    foto4?: string;
    foto5?: string;
  }>();

@ViewChild('abrir')
abrir!: ElementRef;




  @Input() initialData: any;
  maxSizeMB = 100;
  maxPhotos = 5;
  currentPhotos: (FileBase64 | null)[] = Array(5).fill(null);
  form: FormGroup;
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      photos: [[], [this.fileValidator(this.maxSizeMB), Validators.maxLength(this.maxPhotos)]]
    });
  }

  private fileValidator(maxSizeMB: number) {
    return (control: { value: FileBase64[] }) => {
      const totalSize = control.value?.reduce((acc, file) => acc + (file?.size || 0), 0) || 0;
      return totalSize > maxSizeMB * 1024 * 1024 ? { maxSize: true } : null;
    };
  }

  private readFileAsBase64(file: File): Promise<FileBase64> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: reader.result as string
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async onFileSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
      const convertedFile = await this.readFileAsBase64(file);
      this.currentPhotos[index] = convertedFile;
      console.log(this.currentPhotos)
      this.updateFormValidation();
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  removePhoto(index: number) {
    this.currentPhotos[index] = null;
    this.updateFormValidation();
  }

  get totalSizeMB() {
    return (this.currentPhotos.reduce((acc, file) => acc + (file?.size || 0), 0) / (1024 * 1024)).toFixed(2);
  }

  get uploadedCount() {
    return this.currentPhotos.filter(file => file !== null).length;
  }

  private updateFormValidation() {
    const photos = this.currentPhotos.filter(file => file !== null);
    this.form.patchValue({ photos });
    this.form.get('photos')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      const result = {
        foto1: this.currentPhotos[0]?.base64 || '',
        foto2: this.currentPhotos[1]?.base64 || '',
        foto3: this.currentPhotos[2]?.base64 || '',
        foto4: this.currentPhotos[3]?.base64 || '',
        foto5: this.currentPhotos[4]?.base64 || ''
      };

      this.nextStep.emit(result);
    }
  }
  openFileInput(index: number) {
    const fileInput = this.fileInputs.toArray()[index]?.nativeElement;
    if (fileInput) {
      fileInput.value = ''; // Reset para permitir seleccionar el mismo archivo
      fileInput.click();
    }}

  trackByIndex(index: number): number {
    return index;
  }

  a(){
    this.abrir.nativeElement.click()
  }
  
}
