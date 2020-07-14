/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StrFormatService } from './str-format.service';

describe('Service: StrFormat', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StrFormatService]
    });
  });

  it('should ...', inject([StrFormatService], (service: StrFormatService) => {
    expect(service).toBeTruthy();
  }));
});
