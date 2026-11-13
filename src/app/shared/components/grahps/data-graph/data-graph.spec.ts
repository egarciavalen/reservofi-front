import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraph } from './data-graph';

describe('DataGraph', () => {
  let component: DataGraph;
  let fixture: ComponentFixture<DataGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGraph],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGraph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
