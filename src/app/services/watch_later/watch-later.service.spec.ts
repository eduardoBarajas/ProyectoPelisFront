import { TestBed } from '@angular/core/testing';

import { WatchLaterService } from './watch-later.service';

describe('WatchLaterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatchLaterService = TestBed.get(WatchLaterService);
    expect(service).toBeTruthy();
  });
});
