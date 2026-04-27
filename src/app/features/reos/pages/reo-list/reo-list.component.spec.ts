import { ComponentFixture, TestBed } from '@angular/core/testing';
// 1. Asegúrate de que el import coincida con el nombre de la clase en el archivo .ts
import { ReoListComponent } from './reo-list.component'; 

describe('ReoListComponent', () => {
  // 2. Cambia ReoList por ReoListComponent en todas estas líneas:
  let component: ReoListComponent;
  let fixture: ComponentFixture<ReoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReoListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Es mejor usar detectChanges() para inicializar el componente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});