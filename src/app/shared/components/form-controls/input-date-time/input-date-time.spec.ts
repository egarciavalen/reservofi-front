import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateTime } from './input-date-time';

describe('InputDateTime', () => {
  let component: InputDateTime;
  let fixture: ComponentFixture<InputDateTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDateTime],
    }).compileComponents();

    fixture = TestBed.createComponent(InputDateTime);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
