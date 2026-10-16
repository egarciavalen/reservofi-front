import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapViewfinder } from './map-viewfinder';

describe('MapViewfinder', () => {
  let component: MapViewfinder;
  let fixture: ComponentFixture<MapViewfinder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapViewfinder],
    }).compileComponents();

    fixture = TestBed.createComponent(MapViewfinder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
