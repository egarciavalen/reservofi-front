import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaList } from './sala-list';

describe('SalaList', () => {
  let component: SalaList;
  let fixture: ComponentFixture<SalaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaList],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
