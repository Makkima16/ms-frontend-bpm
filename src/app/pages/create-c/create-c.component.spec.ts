import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCComponent } from './create-c.component';

describe('CreateCComponent', () => {
  let component: CreateCComponent;
  let fixture: ComponentFixture<CreateCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
