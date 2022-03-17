import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarComponent {

  constructor( private dialogRef: MatDialogRef<EliminarComponent> ) { }

  borrar() {
    //Confirmar la eliminacion enviando el valor de true
    this.dialogRef.close(true);
  }

  cerrar() {
    this.dialogRef.close();
  }

}
