import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { FileUpload } from '../models/file-upload-model';
import { Area, Career } from 'src/app/interfaces/interfaces';
import { stringToSlug } from 'src/app/utils/stringToSlug';

@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit, AfterViewInit {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild( FormGroupDirective ) formulario!: FormGroupDirective;
  @ViewChild ('modalCrear') modalCrear!: TemplateRef<any>;
  @ViewChild ('modalEditar') modalEditar!: TemplateRef<any>;
  carreras: Career[] = [];
  carrera: Career = {
    id: '',
    name: '',
    duration: 0,
    area: {
      name: '',
      value: ''
    },
    views: 0
  };
  selectedFiles?: any;
  currentFileUpload?: FileUpload;
  url: any;
  format: string = '';
  tipo: string = 'agregar';
  percentage = 0;
  visible = true;
  areas: Area[] = [

    { name: 'Ciencias económicas y empresariales', value: 'economicas' },
    { name: 'Ciencias jurídicas y políticas', value: 'juridicas' },
    { name: 'Ciencias de la salud', value: 'salud' },
    { name: 'Ingenierías y arquitectura', value: 'ingenierias' },
    { name: 'Ciencias exactas y naturales', value: 'exactas' },
    { name: 'Ciencias sociales, educación y humanidades', value: 'sociales' },

  ];
  loading: boolean = true;
  disabled: boolean = false;
  scrollable: boolean = true;
  modalRef?: BsModalRef;

  miFormulario: FormGroup = this.fb.group({
    name: [ '', [ Validators.required, Validators.minLength(3) ] ],
    duration: [ '', [ Validators.required, Validators.min(1) ] ],
    area: [ '', [ Validators.required ] ],
    file: [ '' ],
  })

  constructor( private fb: FormBuilder ,
    private adminService: AdminService, 
    private modalService: BsModalService,
    private toastr: ToastrService,
    private observer: BreakpointObserver,
    public  dialog: MatDialog
) { }
 
  openModal() {
    this.modalRef = this.modalService.show(this.modalCrear);
  }

  openModalEditar() {
    this.modalRef = this.modalService.show(this.modalEditar);
  }

  closeModal() {
    this.modalRef?.hide();
    this.miFormulario.reset();
    this.formulario?.resetForm();
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1?.name === o2?.name && o1?.id === o2?.id;
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }

  selectFile(event: any): void {

    const file = event.target.files && event.target.files[0];

    //Previsualizacion de la imagen
    if( file ) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      if(file.type.indexOf('image')> -1){
        this.selectedFiles = event.target.files;
        this.format = 'image';
        reader.onload = (event) => {
          this.url = (<FileReader>event.target).result;
        }
      } else {
        this.selectedFiles = null;
        this.url = null;
        this.toastr.error('Por favor, solo subir archivos de formato imagen', 'Error')
      }
      
    } else {
      this.url = null;
      this.selectedFiles = null;
    }
  }

  ngOnInit(): void {

    this.modalService.onHidden.subscribe( (_)=> {
      this.miFormulario.reset();
      this.formulario?.resetForm();
      this.url = null;
    })

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras;
      this.loading = false;
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(min-width: 1140px)']).subscribe((res) => {
        if (res.matches) {
          this.scrollable = false;
        } else {
          this.scrollable = true;
        }
      });
    }, 0)
  }

  agregarCarrera() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    
    if( this.carrera.id ){
      //Actualizar
      this.tipo = 'editar';
      this.carrera = {
        ...this.carrera, 
        slug: stringToSlug(this.miFormulario.value.name),
        ...this.miFormulario.value };

      if (this.selectedFiles) {

        this.adminService.eliminarCarreraStorage(this.carrera.photo_filename!)
        
        let filename: string = this.miFormulario.controls['file'].value;
        filename = filename.split('\\').slice(-1)[0];
        this.carrera.photo_filename = filename;
        delete this.carrera.file;
        
        const file: File | null = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
  
        if (file) {
          this.visible = true;
          this.disabled = true;
          this.disableForm();
          this.currentFileUpload = new FileUpload(file);
          this.adminService.agregarCarrera(this.currentFileUpload, this.carrera, this.tipo).subscribe( percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
            if( this.percentage == 100 ){
              setTimeout(() => {
                this.toastr.info('La carrera fue actualizada con éxito!', 'Carrera Actualizada');
                this.enableForm();
                this.url = null;
                this.visible = false;
                this.percentage = 0;
                this.disabled = false;
                this.closeModal();
              }, 500);
            }
          });
        } else {
          this.toastr.error('Por favor, seleccione una imagen para subir', 'Error')
        }
  
      } else {

        const { photo_filename, file, ...carreraData } = this.carrera; 

        this.adminService.actualizarCarrera(carreraData)
          .then( ( _ ) => {
            this.closeModal();
            this.toastr.info('La carrera fue actualizada con éxito', 'Carrera Actualizada')
          })
          .catch( err => {
            console.log(err);
            this.toastr.error(`err`, 'Error');
          })
      }


    } else {

      //Crear
      
      this.carrera = this.miFormulario.value;
      this.carrera.slug = stringToSlug(this.carrera.name);
      this.carrera.views = 0;

      if (this.selectedFiles) {
        let filename: string = this.miFormulario.controls['file'].value;
        filename = filename.split('\\').slice(-1)[0];
        this.carrera.photo_filename = filename;
        delete this.carrera.file;

        const file: File | null = this.selectedFiles.item(0);
        this.selectedFiles = undefined;
  
        if (file) {
          this.disabled = true;
          this.disableForm();
          this.currentFileUpload = new FileUpload(file);
          this.visible = true;
          this.adminService.agregarCarrera(this.currentFileUpload, this.carrera, this.tipo).subscribe( percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
            if( this.percentage == 100 ){
              setTimeout(() => {
                this.toastr.success(`La carrera ${this.carrera.name} fue registrada con éxito!`, 'Carrera Registrada');
                this.enableForm();
                this.miFormulario.reset();
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
        this.toastr.error('Por favor, seleccione una imagen para subir', 'Error')
      }

    }

  }

  obtenerCarrera(id: string) {
    this.openModalEditar();
    this.adminService.obtenerCarreraPorId(id).subscribe( (data: Career) => {
      this.carrera = data;
      this.url = data.photo_url;
      this.format = 'image';
      this.miFormulario.setValue({
        name: data.name,
        duration: data.duration,
        area: data.area,
        file: ''
      });      
    })
  }

  eliminarCarrera( carrera: Career ) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe( (result) => {
        if(result) {
          this.adminService.eliminarCarrera(carrera)
          .then( res => {
            this.toastr.success('La carrera fue eliminada con éxito', 'Carrera eliminada!');
          })
          .catch( err => {
            this.toastr.error(`${err}`, 'Error al eliminar la carrerar');
            console.log('Error al eliminar la carrera', err);
          })
        }
      }
    )

    
  }

  enableForm(): void {
    this.miFormulario.controls['name'].enable();
    this.miFormulario.controls['duration'].enable();
    this.miFormulario.controls['area'].enable();
    this.miFormulario.controls['file'].enable();
  }

  disableForm(): void {
    this.miFormulario.controls['name'].disable();
    this.miFormulario.controls['duration'].disable();
    this.miFormulario.controls['area'].disable();
    this.miFormulario.controls['file'].disable();
  }

}
