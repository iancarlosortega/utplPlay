import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Career } from 'src/app/interfaces/interfaces';

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, SwiperOptions  } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  @Input() area!: string;
  @Input() carreras!: Career[];
  @Input() titulo!: string;

  config: SwiperOptions = {
    breakpoints: {
      // when window width is <= 499px
      499: {
          slidesPerView: 2.2,
      },
      // when window width is <= 999px
      768: {
          slidesPerView: 2.8,
      },
      // when window width is <= 999px
      992: {
          slidesPerView: 4.2,
      }
  }
  };

  constructor() { }

  ngOnInit(): void {
  }

}
