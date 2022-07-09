import { TestBed } from '@angular/core/testing';

import { SiteLoginGuard } from './site-login.guard';

describe('SiteLoginGuard', () => {
  let guard: SiteLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SiteLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
