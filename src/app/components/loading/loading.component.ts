import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  loadingText = '';
  private intervalId: any;
  @Input() text : string = 'Loading.';

  ngOnInit(): void {
    this.loadingText = this.text;
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
      this.loadingText = `${this.text}${dots}`;
    }, 500); // Change the text every 500ms
  }
}
