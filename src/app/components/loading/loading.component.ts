import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loadingText = 'Loading.';
  private intervalId: any;

  ngOnInit(): void {
    this.startLoadingAnimation();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startLoadingAnimation() {
    let dots = '';
    this.intervalId = setInterval(() => {
      if (dots.length < 3) {
        dots += '.';
      } else {
        dots = '';
      }
      this.loadingText = `Loading${dots}`;
    }, 500); // Change the text every 500ms
  }
}
