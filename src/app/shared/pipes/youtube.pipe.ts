import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'youtube'
})
export class YoutubePipe implements PipeTransform {

  transform(url: string): string {

    let youtubeId = ''

    if( url.includes('youtu.be') ){
      const urlArray = url.split('/');
      youtubeId = urlArray[ urlArray.length - 1];
    } else {
      youtubeId = url.split('=')[1];
    }

    return `https://www.youtube.com/embed/${youtubeId}`;
  }

}
