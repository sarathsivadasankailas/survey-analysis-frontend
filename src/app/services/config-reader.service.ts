import { Injectable } from '@angular/core';
import { DefaultConfig } from '../config/default-config'


@Injectable({
  providedIn: 'root'
})
export class ConfigReaderService {

  constructor() { }

  getNavMenu() {
    return DefaultConfig.navigations;
  }
}
