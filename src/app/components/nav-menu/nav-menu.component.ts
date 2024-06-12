import { Component } from '@angular/core';
import { ConfigReaderService } from 'src/app/services/config-reader.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  navigationMenu: any;
  selectedMenuItem: any;

  constructor(private configReader: ConfigReaderService) {
    this.navigationMenu = configReader.getNavMenu();
  }
}
