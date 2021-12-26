import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-elegir-materias',
  templateUrl: './elegir-materias.component.html',
  styleUrls: ['./elegir-materias.component.css']
})
export class ElegirMateriasComponent implements OnInit {

  materias: Course[] = [];
  materiasAux: Course[] = [];

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerMaterias().subscribe( materias => {
      //Devolver las materias ordenadas por el nombre
      this.materiasAux = materias.sort( (a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      this.materias = this.materiasAux.slice(0,9);
    })

  }

  paginate(event: any) {
    const primero = event.first;
    const ultimo = primero + event.rows;
    this.materias = this.materiasAux.slice( primero, ultimo );
  }   

}
