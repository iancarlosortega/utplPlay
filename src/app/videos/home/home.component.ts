import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Career } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  carreras!: Career[]

  constructor( private adminService: AdminService 
  ) { }

  ngOnInit(): void {

    this.adminService.obtenerCarreras().subscribe( carreras => {
      this.carreras = carreras;
    });

  }

}
