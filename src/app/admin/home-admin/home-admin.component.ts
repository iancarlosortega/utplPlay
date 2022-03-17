import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout'

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements AfterViewInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  phone: boolean = true;

  constructor( private observer: BreakpointObserver ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
        if (res.matches) {
          this.phone = true;
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.phone = false;
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
    }, 0)
  }

  closeSidenav() {
    if(this.phone){
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }
  }


}
