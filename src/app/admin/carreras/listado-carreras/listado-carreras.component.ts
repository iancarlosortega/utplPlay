import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Carrera } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-listado-carreras',
  templateUrl: './listado-carreras.component.html',
  styleUrls: ['./listado-carreras.component.css']
})
export class ListadoCarrerasComponent implements OnInit, OnDestroy {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild ('formulario') formulario!: any;
  @ViewChild ('modalCrear') modalCrear!: TemplateRef<any>;
  @ViewChild ('modalEditar') modalEditar!: TemplateRef<any>;

  $: any;
  id?: string;
  carreras: Carrera[] = [];
  carrera!: Carrera;
  loading: boolean = true;
  modalRef?: BsModalRef;

  miFormulario: FormGroup = this.fb.group({
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ],
    num_ciclos: [ '', [ Validators.required, Validators.min(1) ] ],
  })

  matcher = new MyErrorStateMatcher();

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
  }
 
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

  closeModalEditar() {
    this.modalRef?.hide();
    this.miFormulario.reset();
    this.formulario?.resetForm();
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  constructor( private adminService: AdminService, 
               private modalService: BsModalService,
               private fb: FormBuilder ,
               private toastr: ToastrService
  ) { }


  ngOnDestroy(): void {
    this.modalService.onHidden.unsubscribe();
  }

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

    this.adminService.agregarCarrera(this.carrera)
      .then( res => {
        this.modalRef?.hide();
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.success(`La carrera ${this.carrera.nombre} fue registrada con éxito!`, 'Carrera Registrada');
      })
      .catch( err => {
        console.log('Error al agregar la carrera', err);
      })

  }

  editarCarrera(id: string) {
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

    this.adminService.actualizarCarrera(this.id!, this.carrera )
      .then( res => {
        this.modalRef?.hide();
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.info(`La carrera ${this.carrera} fue actualizada con éxito`, 'Carrera actualizada!');
      })
      .catch( err => {
        console.log('Error al actualizar la carrerar', err);
      })
  }

  eliminarCarrera( id: string ) {
    //TODO: Agregar modal de confirmación
    this.adminService.eliminarCarrera(id)
      .then( res => {
        console.log(res);
        this.toastr.error(`La carrera ${this.carrera} fue eliminada con éxito`, 'Carrera eliminada!');
      })
      .catch( err => {
        console.log('Error al eliminar la carrera', err);
      })
  }

}
