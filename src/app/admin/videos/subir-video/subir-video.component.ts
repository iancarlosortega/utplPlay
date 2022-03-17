import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { FileUpload } from '../../models/file-upload-model';
import { Course, Video } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-subir-video',
  templateUrl: './subir-video.component.html',
  styleUrls: ['./subir-video.component.css']
})
export class SubirVideoComponent implements OnInit {

  @ViewChild(FormGroupDirective) formulario!: FormGroupDirective;
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  video: Video = {
    id : '',
    title : '',
    teacher : '',
    course : {
      id: '',
      name: '',
      description: '',
      views: 0
    },
    views : 0,
    url : '',
    publication_date: null
  }
  tipo: string = 'agregar';
  materias!: Course[];
  materiasAux!: any[];
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  percentage = 0;
  visible = true;
  disabled = false;

  miFormulario: FormGroup = this.fb.group({
    title: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    teacher: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    course: [ { value: '', disabled: false }, [ Validators.required, Validators.minLength(3) ] ],
    file: [{ value: '', disabled: false }]
  })

  constructor( private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
    
) { }

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.name === o2?.name && o1?.id === o2?.id;
  }

  ngOnInit(): void {

    this.adminService.obtenerMateriasVideos().subscribe( materias => {
      this.materias = materias;
      this.materiasAux = materias;
    });

    if( !this.router.url.includes('editar') ) {
      return;
    }

    // Si la ruta es de editar traer la informacion segun su id para rellenar los campos del formulario
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerVideoPorId(id) )
      )
      .subscribe( (video: Video) => {
        //Rellenar el formulario con la informacion obtenida
        this.video = video;
        this.format = 'video';
        this.url = video.url;
        this.miFormulario.reset({
          ...this.video
        });
      });

  }

  selectFile(event: any): void {

    const file = event.target.files && event.target.files[0];
    console.log(file);

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
      this.selectedFiles = null;
    }
  }

  subirVideo() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    
    if( this.video.id ){
      //Actualizar
      console.log('Editar');
      this.tipo = 'editar';
      this.video = {...this.video, ...this.miFormulario.value };

      if (this.selectedFiles) {

        this.adminService.eliminarVideoStorage(this.video.filename!)
        
        let filename: string = this.miFormulario.controls['file'].value;
        filename = filename.split('\\').slice(-1)[0];
        this.video.filename = filename;
        delete this.video.file;
        
        
        const file: File | null = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
  
        if (file) {
          this.disabled = true;
          this.disableForm();
          this.currentFileUpload = new FileUpload(file);
          this.adminService.subirVideo(this.currentFileUpload, this.video, this.tipo).subscribe( percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
            if( this.percentage == 100 ){
              setTimeout(() => {
                this.toastr.info('El video fue subido con éxito!', 'Video Subido');
                this.router.navigateByUrl('/admin/videos');
                this.enableForm();
                this.url = null;
                this.visible = false;
                this.percentage = 0;
                this.disabled = false
              }, 500);
            }
          });
        } else {
          this.toastr.error('Por favor, seleccione un video para subir', 'Error')
        }
  
      } else {

        const { filename, file, ...videoData } = this.video; 

        this.adminService.actualizarVideo(videoData)
          .then( ( _ ) => {
            this.toastr.info('El video fue actualizado con éxito', 'Video Actualizado');
            this.router.navigateByUrl('/admin/videos');
          })
          .catch( err => {
            console.log(err);
            this.toastr.error(`err`, 'Error');
          })
      }


    } else {

      //Crear
      
      this.video = this.miFormulario.value;
      this.video.views = 0;
      this.video.publication_date = new Date();

      if (this.selectedFiles) {

        let filename: string = this.miFormulario.controls['file'].value;
        filename = filename.split('\\').slice(-1)[0];
        this.video.filename = filename;
        delete this.video.file;

        const file: File | null = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
  
        if (file) {
          this.disabled = true;
          this.disableForm();
          this.currentFileUpload = new FileUpload(file);
          this.adminService.subirVideo(this.currentFileUpload, this.video, this.tipo).subscribe( percentage => {
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
        } else {
          this.toastr.error('Error', 'Error')
        }
  
      } else {
        this.toastr.error('Por favor, seleccione un video para subir', 'Error')
      }

    }

  }

  enableForm(): void {
    this.miFormulario.controls['title'].enable();
    this.miFormulario.controls['teacher'].enable();
    this.miFormulario.controls['course'].enable();
    this.miFormulario.controls['file'].enable();
  }

  disableForm(): void {
    this.miFormulario.controls['title'].disable();
    this.miFormulario.controls['teacher'].disable();
    this.miFormulario.controls['course'].disable();
    this.miFormulario.controls['file'].disable();
  }

  
  filtrarMaterias($event: any) {
    let valor: string = $event.target.value.toLowerCase().trim();

    this.materias = this.materiasAux
    this.materias = this.materias.filter((materia: Course) => {
      const nombreMateria = materia.name.toLowerCase();
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
