import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';

@Component({
  selector: 'app-learnings-dashboard',
  templateUrl: './learnings-dashboard.component.html',
  styleUrls: ['./learnings-dashboard.component.css']
})
export class LearningsDashboardComponent {
  chart: any;
  semesters: any;
  selectedsemesters: any[] = [];
  labels: string[] = [];
  data: any[] = [];
  responseData: any;

  learningMethodsData = {
    labels:this.labels,
    datasets: [
      {
        label: "Learning Methods",
        data: this.data,
        backgroundColor: "rgba(0,0,255)",
        barThickness: 25
      }
    ]
  }

  constructor(private backendSvc: BackendCommunicationService) {}


  ngOnInit() {
    this.initializeData();
  }

  initializeData() {
    this.backendSvc.getLearningMethods().subscribe(response => {
        console.log(response);
        this.semesters = response?.classes;
        this.learningMethodsData.labels = response?.labels;
        this.responseData = response?.responseData;
        this.drawLearningMethods();
      }
    );
  }

  drawLearningMethods() {
    this.chart = new Chart("learning_methods_graph", {
      type: "bar",
      data: this.learningMethodsData,
      options: {
        indexAxis: 'y'
      }
    });
  }

  onSelectionChange(semester:any) {
    console.log(semester)
    if (this.selectedsemesters.includes(semester)) {
      this.selectedsemesters = this.selectedsemesters.filter(item => item != semester);
    } else {
      this.selectedsemesters.push(semester);
    }
    console.log(this.selectedsemesters);
    this.updateGraphData();
    this.chart.update();
  }

  updateGraphData() {
    let size = this.learningMethodsData.labels.length;
    for (let i = 0; i < size; i++) {
      this.data[i] = 0;
    }
    let semesterData:any = [];
    this.selectedsemesters.forEach((semester:any) => {
      let res = this.responseData.find((item:any) =>
        item.name == semester.name &&
        item.year == semester.year &&
        item.semester == semester.semester
      );
      semesterData.push(res);
    });
    semesterData.forEach((item:any) => {
      item?.methods.forEach((method:any) => {
        let index = this.learningMethodsData.labels.indexOf(method.method);
        let scores = method?.scores;
        let totalScores = 0;
        for (let i=0; i< scores.length; i++) {
          totalScores  = totalScores + ((i+1)*scores[i]);
        }
        this.data[index] += totalScores;
      });
    });
  }
}
