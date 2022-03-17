import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  paises: string[] = [];
  baseUrl: string = environment.paisesURL;

  constructor( private http: HttpClient ) { }

  obtenerPaises() {
    this.http.get(`${this.baseUrl}/countries/iso`).subscribe( (res: any) => {
      res['data'].forEach( (element: any) => {
        this.paises.push( element.name );
      });
    });
    return this.paises;
  }

  obtenerCiudadesSegunPais( pais: string ) {
    return this.http.post(`${this.baseUrl}/countries/cities`, { country : pais });
  }

}
