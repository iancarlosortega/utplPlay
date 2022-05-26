import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Course } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-elegir-materias',
  templateUrl: './elegir-materias.component.html',
  styleUrls: ['./elegir-materias.component.css']
})
export class ElegirMateriasComponent implements OnInit {

  length: number = 0;
  materias: Course[] = [];
  materiasTotales: Course[] = [];
  materiasAux: Course[] = [];

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerMaterias().subscribe( materias => {
      //Devolver las materias ordenadas por el nombre
      this.materiasTotales = materias.sort( (a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      this.materiasAux = this.materiasTotales;
      this.length = this.materiasTotales.length;
      this.materias = this.materiasTotales.slice(0,9);
    })

  }

  paginate(event: any) {
    const primero = event.first;
    const ultimo = primero + event.rows;
    this.materias = this.materiasAux.slice( primero, ultimo );
  }   

  buscar( event: any ){

    const value = event.target.value.trim().toLowerCase();
    this.materias = this.materiasTotales.filter( video => video.name.toLowerCase().includes(value) );
    this.length = this.materias.length;
    this.materiasAux = this.materias;
    this.materias = this.materias.slice(0,9);

  }

}
