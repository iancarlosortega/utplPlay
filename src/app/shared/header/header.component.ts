import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit  {

  hidden: boolean = false;

  ngOnInit(): void {

    if( this.router.url === '/play' ) {
      this.hidden = true;
    }

    const res = this.authService.obtenerClaims();
    console.log(res);
    
  }

  constructor( private authService: AuthService,
               private router: Router
  ) {}

  logout() {
    this.authService.logout();
    console.log('logout');
  }

}
