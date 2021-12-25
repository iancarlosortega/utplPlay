import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'space'
})
export class SpacePipe implements PipeTransform {

  transform(value: string[]): string {
    return (value?.length > 0) ? value?.join().replace(/,/g, ', ') : '';
  }

}
