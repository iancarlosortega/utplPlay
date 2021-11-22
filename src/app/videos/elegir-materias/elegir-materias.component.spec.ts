import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirMateriasComponent } from './elegir-materias.component';

describe('ElegirMateriasComponent', () => {
  let component: ElegirMateriasComponent;
  let fixture: ComponentFixture<ElegirMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElegirMateriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElegirMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
