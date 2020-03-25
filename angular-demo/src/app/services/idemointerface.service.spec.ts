import { TestBed } from '@angular/core/testing';

import { IdemointerfaceService } from './idemointerface.service';

describe('IdemointerfaceService', () => {
  let service: IdemointerfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdemointerfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
