import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEmail } from './input-email';

describe('InputEmail', () => {
  let component: InputEmail;
  let fixture: ComponentFixture<InputEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputEmail],
    }).compileComponents();

    fixture = TestBed.createComponent(InputEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
