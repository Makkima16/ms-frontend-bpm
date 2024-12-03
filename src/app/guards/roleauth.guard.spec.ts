import { TestBed } from '@angular/core/testing';

import { RoleauthGuard } from './roleauth.guard';

describe('RoleauthGuard', () => {
  let guard: RoleauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleauthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
