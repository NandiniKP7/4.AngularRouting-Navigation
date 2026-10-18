import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseActivitiesComponent } from './house-activities.component';

describe('HouseActivitiesComponent', () => {
  let component: HouseActivitiesComponent;
  let fixture: ComponentFixture<HouseActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseActivitiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HouseActivitiesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
