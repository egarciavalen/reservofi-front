import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaData } from './reserva-data';

describe('ReservaData', () => {
  let component: ReservaData;
  let fixture: ComponentFixture<ReservaData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaData],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
