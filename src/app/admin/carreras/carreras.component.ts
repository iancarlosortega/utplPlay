import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Carrera } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
import { EliminarComponent } from '../eliminar/eliminar.component';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-carreras',
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit, OnDestroy {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild ('formulario') formulario!: any;
  @ViewChild ('modalCrear') modalCrear!: TemplateRef<any>;
  @ViewChild ('modalEditar') modalEditar!: TemplateRef<any>;

  id?: string;
  carreras: Carrera[] = [];
  carrera!: Carrera;
  loading: boolean = true;
  disabled: boolean = false;
  modalRef?: BsModalRef;

  miFormulario: FormGroup = this.fb.group({
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ],
    num_ciclos: [ '', [ Validators.required, Validators.min(1) ] ],
  })

  //Errores de formulario
  matcher = new MyErrorStateMatcher();
 
  openModal() {
    this.modalRef = this.modalService.show(this.modalCrear);
  }

  closeModal() {
    this.modalRef?.hide();
    this.miFormulario.reset();
    this.formulario?.resetForm();
  }

  openModalEditar() {
    this.modalRef = this.modalService.show(this.modalEditar);
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  constructor( private fb: FormBuilder ,
               private adminService: AdminService, 
               private modalService: BsModalService,
               private toastr: ToastrService,
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
        this.toastr.success(`La carrera ${this.carrera.nombre} fue registrada con éxito!`, 'Carrera Registrada');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al agregar la carrerar');
        console.log('Error al agregar la carrera', err);
      })

  }

  obtenerCarrera(id: string) {
    this.openModalEditar();
    this.adminService.getCarreraById(id).subscribe( (data: any) => {
      if( data.type != 'removed' ) {
        this.id = data.payload.id;
        this.miFormulario.setValue({
          nombre: data.payload.data()['nombre'],
          num_ciclos: data.payload.data()['num_ciclos'],
        });
      }
      
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
        this.toastr.info(`La carrera ${this.carrera.nombre} fue actualizada con éxito`, 'Carrera actualizada!');
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

  ngOnDestroy(): void {
    this.modalService.onHidden.unsubscribe();
  }

}
