import { TestBed } from '@angular/core/testing';

import { AprobadosService } from './aprobados.service';

describe('AprobadosService', () => {
  let service: AprobadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AprobadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
