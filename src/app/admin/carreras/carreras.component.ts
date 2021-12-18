import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
import { Area, Career } from 'src/app/interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { EliminarComponent } from '../eliminar/eliminar.component';
import { BreakpointObserver } from '@angular/cdk/layout';

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

  id?: string;
  carreras: Career[] = [];
  carrera!: Career;
  selectedValue: string = 'Holaaaa';
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
  })
 
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

  constructor( private fb: FormBuilder ,
               private adminService: AdminService, 
               private modalService: BsModalService,
               private toastr: ToastrService,
               private observer: BreakpointObserver,
               public  dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.modalService.onHidden.subscribe( (_)=> {
      this.miFormulario.reset();
      this.formulario?.resetForm();
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

    this.carrera = this.miFormulario.value;

    this.disabled = true;
    this.adminService.agregarCarrera(this.carrera)
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.success(`La carrera ${this.carrera.name} fue registrada con éxito!`, 'Carrera Registrada');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al agregar la carrerar');
        console.log('Error al agregar la carrera', err);
      })

  }

  obtenerCarrera(id: string) {
    this.openModalEditar();
    this.adminService.obtenerCarreraPorId(id).subscribe( (data: Career) => {
      console.log(data);
      this.id = data.id;
      this.miFormulario.setValue({
        name: data.name,
        duration: data.duration,
        area: data.area
      });      
    })
  }

  actualizarCarrera() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.carrera = this.miFormulario.value;

    this.disabled = true;
    this.adminService.actualizarCarrera(this.id!, this.carrera )
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.info(`La carrera ${this.carrera.name} fue actualizada con éxito`, 'Carrera actualizada!');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al actualizar la carrerar');
        console.log('Error al actualizar la carrerar', err);
      })
  }

  eliminarCarrera( id: string ) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe( (result) => {
        if(result) {
          this.adminService.eliminarCarrera(id)
          .then( res => {
            console.log(res);
            this.toastr.error('La carrera fue eliminada con éxito', 'Carrera eliminada!');
          })
          .catch( err => {
            this.toastr.error(`${err}`, 'Error al eliminar la carrerar');
            console.log('Error al eliminar la carrera', err);
          })
        }
      }
    )

    
  }

}
