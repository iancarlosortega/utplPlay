import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Career } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-elegir-carreras',
  templateUrl: './elegir-carreras.component.html',
  styleUrls: ['./elegir-carreras.component.css']
})
export class ElegirCarrerasComponent implements OnInit {

  carrerasTotales: Career[] = [];
  carreras: Career[] = [];
  economicas: Career[] = []; 
  juridicas: Career[] = []; 
  salud: Career[] = []; 
  ingenierias: Career[] = []; 
  exactas: Career[] = []; 
  sociales: Career[] = []; 

  constructor( private adminService: AdminService ) { }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carrerasTotales = carreras;
      this.carreras = carreras;
      this.filtrar(carreras);
    });

  }

  filtrar(carreras: Career[]) {
    this.ingenierias = this.shuffle(carreras.filter( carrera => carrera.area.value === 'ingenierias' )); 
    this.juridicas = this.shuffle(carreras.filter( carrera => carrera.area.value === 'juridicas' )); 
    this.salud = this.shuffle(carreras.filter( carrera => carrera.area.value === 'salud' )); 
    this.economicas = this.shuffle(carreras.filter( carrera => carrera.area.value === 'economicas' )); 
    this.exactas = this.shuffle(carreras.filter( carrera => carrera.area.value === 'exactas' )); 
    this.sociales = this.shuffle(carreras.filter( carrera => carrera.area.value === 'sociales' )); 
  }

  shuffle(array: any) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  buscar( event: any ){

    const value = event.target.value.trim().toLowerCase();
    this.carreras = this.carrerasTotales.filter( carrera => carrera.name.toLowerCase().includes(value) );
    this.filtrar(this.carreras)

  }

}
