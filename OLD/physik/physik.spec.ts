import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Physik } from './physik';

describe('Physik', () => {
  let component: Physik;
  let fixture: ComponentFixture<Physik>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Physik]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Physik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
