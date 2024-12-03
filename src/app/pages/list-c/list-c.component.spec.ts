import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCComponent } from './list-c.component';

describe('ListCComponent', () => {
  let component: ListCComponent;
  let fixture: ComponentFixture<ListCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
