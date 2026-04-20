import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReoForm } from './reo-form.component';

describe('ReoForm', () => {
  let component: ReoForm;
  let fixture: ComponentFixture<ReoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ReoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
