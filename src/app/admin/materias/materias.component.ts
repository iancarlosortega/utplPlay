import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { Table } from 'primeng/table';
import { Carrera, Materia } from 'src/app/interfaces/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { EliminarComponent } from '../eliminar/eliminar.component';
@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export class MateriasComponent implements OnInit {

  @ViewChild ('dt') dt: Table | undefined;
  @ViewChild ('formulario') formulario!: any;
  @ViewChild ('modalCrear') modalCrear!: TemplateRef<any>;
  @ViewChild ('modalEditar') modalEditar!: TemplateRef<any>;

  id?: string;
  carreras: Carrera[] = [];
  materias: Materia[] = [];
  materia!: Materia;
  loading: boolean = true;
  disabled: boolean = false;
  modalRef?: BsModalRef;

  miFormulario: FormGroup = this.fb.group({
    nombre: [ '', [ Validators.required, Validators.minLength(3) ] ],
    carreras: [ '', [ Validators.required, Validators.minLength(1) ] ],
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

  campoNoValido( campo: string) {
    return this.miFormulario.get(campo)?.invalid && this.miFormulario.get(campo)?.touched;
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

    this.adminService.obtenerMaterias().subscribe( materias => {
      this.materias = materias;
      this.loading = false;
    });

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras
    })

  }

  agregarMateria() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      this.miFormulario.controls['carreras'].markAsDirty();
      return;
    }

    this.materia = this.miFormulario.value;

    this.disabled = true;
    this.adminService.agregarMateria(this.materia)
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.success(`La carrera ${this.materia.nombre} fue registrada con éxito!`, 'Materia Registrada');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al agregar la materia');
        console.log('Error al agregar la materia', err);
      })

  }

  obtenerMateria(id: string) {
    this.openModalEditar();
    this.adminService.getMateriaById(id).subscribe( (data: any) => {
      if( data.type != 'removed' ) {
        this.id = data.payload.id;
        this.miFormulario.setValue({
          nombre: data.payload.data()['nombre'],
          carreras: data.payload.data()['carreras'],
        });
      }
      
    })
  }

  actualizarMateria() {

    if( this.miFormulario.invalid ) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.materia = this.miFormulario.value;

    this.disabled = true;
    this.adminService.actualizarMateria(this.id!, this.materia )
      .then( res => {
        this.modalRef?.hide();
        this.disabled = false;
        this.miFormulario.reset();
        this.formulario?.resetForm();
        this.toastr.info(`La materia ${this.materia.nombre} fue actualizada con éxito`, 'Materia actualizada!');
      })
      .catch( err => {
        this.toastr.error(`${err}`, 'Error al actualizar la materia');
        console.log('Error al actualizar la materia', err);
      })
  }

  eliminarMateria( id: string ) {
    //Ventana modal para confirmar la eliminacion
    const dialog = this.dialog.open(EliminarComponent, {
      width: '400px'
    });

    dialog.afterClosed().subscribe( (result) => {
        if(result) {
          this.adminService.eliminarMateria(id)
          .then( res => {
            console.log(res);
            this.toastr.error('La materia fue eliminada con éxito', 'Materia eliminada!');
          })
          .catch( err => {
            this.toastr.error(`${err}`, 'Error al eliminar la materia');
            console.log('Error al eliminar la materia', err);
          })
        }
      }
    )

    
  }

}
