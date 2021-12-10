import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  @ViewChild ('modal') modal!: TemplateRef<any>;

  $: any;
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
    this.modalRef = this.modalService.show(this.modal);
  }

  closeModal() {
    this.modalRef?.hide();
    this.miFormulario.reset();
    this.formulario?.resetForm();
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  constructor( private adminService: AdminService, 
               private modalService: BsModalService,
               private fb: FormBuilder 
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
        // this.modalRef?.hide();
        this.miFormulario.reset();
        this.formulario?.resetForm();
      })
      .catch( err => {
        console.log('Error al agregar la carrera', err);
      })

  }

  editarCarrera(id: string) {
    this.openModal();
    this.adminService.getCarreraById(id).subscribe( (data: any) => {
      this.miFormulario.setValue({
        nombre: data.payload.data()['nombre'],
        num_ciclos: data.payload.data()['num_ciclos'],
      })
    })
  }

  eliminarCarrera( id: string ) {
    this.adminService.eliminarCarrera(id)
      .then( res => {
        console.log(res);
      })
      .catch( err => {
        console.log('Error al eliminar la carrera', err);
      })
  }

}
