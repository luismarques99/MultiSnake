import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateAppComponent } from './private-app.component';

describe('PrivateAppComponent', () => {
  let component: PrivateAppComponent;
  let fixture: ComponentFixture<PrivateAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
