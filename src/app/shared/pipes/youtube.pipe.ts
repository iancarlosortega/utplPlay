import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtube'
})
export class YoutubePipe implements PipeTransform {

  transform(url: string): string {

    const youtubeId = url.split('=')[1]

    return `https://www.youtube.com/embed/${youtubeId}`;
  }

}
