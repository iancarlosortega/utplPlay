import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Course } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-ver-carrera',
  templateUrl: './ver-carrera.component.html',
  styleUrls: ['./ver-carrera.component.css']
})
export class VerCarreraComponent implements OnInit {

  materias!: Course[]

  constructor( private activatedRoute: ActivatedRoute,
               private adminService: AdminService  
  ) { }

  ngOnInit(): void {

    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.adminService.obtenerCarreraPorId(id) )
      )
      .subscribe( carrera => {
        this.adminService.obtenerMateriasPorCarrera(carrera).subscribe( materias => {
          this.materias = materias
        })
      });

  }

}
