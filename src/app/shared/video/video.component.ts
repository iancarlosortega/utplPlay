import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent {

  @Input('url') url: string = '';
  url2: string = 'https://www.youtube.com/embed/mOMcoXp1GRw';

}
