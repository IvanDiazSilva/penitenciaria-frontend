import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidenciaDialog } from './incidencia-dialog';

describe('IncidenciaDialog', () => {
  let component: IncidenciaDialog;
  let fixture: ComponentFixture<IncidenciaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidenciaDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidenciaDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
