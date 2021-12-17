import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Career } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-elegir-carreras',
  templateUrl: './elegir-carreras.component.html',
  styleUrls: ['./elegir-carreras.component.css']
})
export class ElegirCarrerasComponent implements OnInit {

  economicas: Career[] = []; 
  juridicas: Career[] = []; 
  salud: Career[] = []; 
  ingenierias: Career[] = []; 
  exactas: Career[] = []; 
  sociales: Career[] = []; 

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.ingenierias = carreras.filter( carrera => carrera.area.value === 'ingenierias' )
      this.juridicas = carreras.filter( carrera => carrera.area.value === 'juridicas' )
      this.salud = carreras.filter( carrera => carrera.area.value === 'salud' )
      this.economicas = carreras.filter( carrera => carrera.area.value === 'economicas' )
      this.exactas = carreras.filter( carrera => carrera.area.value === 'exactas' )
      this.sociales = carreras.filter( carrera => carrera.area.value === 'sociales' )
      console.log(this.ingenierias);
    });

  }

}
