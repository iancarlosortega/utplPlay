import { Pipe, PipeTransform } from '@angular/core';
import { Career } from 'src/app/interfaces/interfaces';

@Pipe({
  name: 'carreras'
})
export class CarrerasPipe implements PipeTransform {

  transform(carreras: Career[]): string[] {

    if( carreras.length > 0 ) {
      const carrerasNombres: string[] = [];

      carreras.forEach(carrera => {
        carrerasNombres.push(carrera.name);
      });

      return carrerasNombres;
    } else {
      return [];
    }

    
  }

}
