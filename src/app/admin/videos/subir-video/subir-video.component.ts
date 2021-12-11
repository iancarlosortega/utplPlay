import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Materia, Video } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
import { FileUpload } from '../models/file-upload-model';

@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrls: ['./subir-video.component.css']
})
export class SubirVideoComponent implements OnInit {

  @ViewChild(FormGroupDirective) formulario!: FormGroupDirective;
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  video!: Video;
  materias!: Materia[];
  materiasAux!: any[];
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  percentage = 0;
  visible = true;
  disabled = false;

  miFormulario: FormGroup = this.fb.group({
    titulo: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    tutor: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    materia: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    file: [{ value: '', disabled: false } , [Validators.required]  ]
  })

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  constructor( private fb: FormBuilder,
               private adminService: AdminService,
               private toastr: ToastrService,
    ) { }

  ngOnInit(): void {

    this.adminService.obtenerMateriasVideos().subscribe( materias => {
      this.materias = materias;
      this.materiasAux = materias;
    });

  }

  selectFile(event: any): void {

    const file = event.target.files && event.target.files[0];
    
    //Previsualizacion del video
    if( file ) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('video')> -1){
        this.selectedFiles = event.target.files;
        this.format = 'video';
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        }
      } else {
        this.miFormulario.controls['file'].setValue(null);
        this.selectedFiles = null;
        this.url = null;
        this.toastr.error('Por favor, solo subir archivos de formato video', 'Error')
      }
      
    } else {
      this.url = null;
    }
  }

  subirVideo() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    this.disabled = true;
    this.disableForm();
    this.video = this.miFormulario.value;
    this.video.visualizaciones = 0;
    this.video.fecha_publicacion = new Date();
    delete this.video.file;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.adminService.subirVideo(this.currentFileUpload, this.video).subscribe( percentage => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if( this.percentage == 100 ){
            setTimeout(() => {
              this.toastr.success('El video fue subido con éxito!', 'Video Subido');
              this.miFormulario.reset();
              this.formulario.resetForm();
              this.enableForm();
              this.url = null;
              this.visible = false;
              this.percentage = 0;
              this.disabled = false
            }, 500);
          }
        });
      }

    }

  }

  enableForm(): void {
    this.miFormulario.controls['titulo'].enable();
    this.miFormulario.controls['tutor'].enable();
    this.miFormulario.controls['materia'].enable();
    this.miFormulario.controls['file'].enable();
  }

  disableForm(): void {
    this.miFormulario.controls['titulo'].disable();
    this.miFormulario.controls['tutor'].disable();
    this.miFormulario.controls['materia'].disable();
    this.miFormulario.controls['file'].disable();
  }

  
  filtrarMaterias($event: any) {
    let valor: string = $event.target.value;
    valor = valor.toLowerCase().trim();

    this.materias = this.materiasAux
    this.materias = this.materias.filter((materia: Materia) => {
      const nombreMateria = materia.nombre.toLowerCase();
      if( nombreMateria.includes(valor) ) {
        return true;
      } else {
        return false;
      }
    });
  }

  limpiarBuscador() {
    this.txtBuscar.nativeElement.value = '';
    this.materias = this.materiasAux;
  }
}
