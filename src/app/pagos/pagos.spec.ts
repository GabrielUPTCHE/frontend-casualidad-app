import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosComponent } from './pagos';

describe('PagosComponent', () => {
  let component: PagosComponent;
  let fixture: ComponentFixture<PagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
