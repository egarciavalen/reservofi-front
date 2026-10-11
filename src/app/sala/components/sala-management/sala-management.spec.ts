import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaManagement } from './sala-management';

describe('SalaManagement', () => {
  let component: SalaManagement;
  let fixture: ComponentFixture<SalaManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
