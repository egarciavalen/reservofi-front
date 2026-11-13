import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuestoData } from './puesto-data';

describe('PuestoData', () => {
  let component: PuestoData;
  let fixture: ComponentFixture<PuestoData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuestoData],
    }).compileComponents();

    fixture = TestBed.createComponent(PuestoData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
