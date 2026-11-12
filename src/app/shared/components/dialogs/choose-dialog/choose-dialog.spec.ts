import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDialog } from './choose-dialog';

describe('ChooseDialog', () => {
  let component: ChooseDialog;
  let fixture: ComponentFixture<ChooseDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
