import { TestBed } from '@angular/core/testing';

import { Login2Service } from './login.service';

describe('LoginService', () => {
  let service: Login2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Login2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
