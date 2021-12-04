import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  paises: string[] = [];

  constructor( private http: HttpClient ) { }

  obtenerPaises() {
    this.http.get('https://countriesnow.space/api/v0.1/countries/iso').subscribe( (res: any) => {
      res['data'].forEach( (element: any) => {
        this.paises.push( element.name );
      });
    });
    return this.paises;
  }

  obtenerCiudadesSegunPais( pais: string ) {
    return this.http.post('https://countriesnow.space/api/v0.1/countries/cities', { country : pais });
  }

}
