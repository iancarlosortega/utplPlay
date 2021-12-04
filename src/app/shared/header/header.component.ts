import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {

  ngOnInit(): void {
  }

  constructor( private authService: AuthService ) {}

  logout() {
    this.authService.logout();
    console.log('logout');
  }

}
