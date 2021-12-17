import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCarreraComponent } from './ver-carrera.component';

describe('VerCarreraComponent', () => {
  let component: VerCarreraComponent;
  let fixture: ComponentFixture<VerCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
