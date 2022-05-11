import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit {

  @Input () titulo: string = '';
  @Input () src: string = '';
  @Input () contador: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
