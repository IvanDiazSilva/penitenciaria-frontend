import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReoDialog } from './reo-dialog';

describe('ReoDialog', () => {
  let component: ReoDialog;
  let fixture: ComponentFixture<ReoDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReoDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ReoDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
