import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaData } from './sala-data';

describe('SalaData', () => {
  let component: SalaData;
  let fixture: ComponentFixture<SalaData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaData],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
