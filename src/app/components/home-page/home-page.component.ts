import { Component } from '@angular/core';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor() {}

  dbData: any;


  ngOnInit() {
    let height = window.innerHeight;
    let headerElement = document.getElementById('header');
    if (headerElement) {
      height -= headerElement.clientHeight;
    }
    let element = document.getElementById('home');
    if (element) {
      element.style.height = height + 'px';
    }
  }

}
