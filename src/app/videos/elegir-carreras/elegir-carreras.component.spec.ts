import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirCarrerasComponent } from './elegir-carreras.component';

describe('ElegirCarrerasComponent', () => {
  let component: ElegirCarrerasComponent;
  let fixture: ComponentFixture<ElegirCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElegirCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElegirCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
