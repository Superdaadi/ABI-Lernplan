import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lernplan } from './lernplan';

describe('Lernplan', () => {
  let component: Lernplan;
  let fixture: ComponentFixture<Lernplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lernplan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lernplan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
