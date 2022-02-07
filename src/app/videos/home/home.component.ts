import { Component, OnInit } from '@angular/core';
import { Career, Course } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carreras: Career[] = [];
  materias: Course[] = [];

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice( 0,6 );
    })

    this.adminService.obtenerMaterias().subscribe( materias => {
      this.materias = materias.sort((a,b) => (a.views < b.views) ? 1 : ((b.views < a.views) ? -1 : 0)).slice( 0,6 );
    })

  }

}
