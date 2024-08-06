import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
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
  loading: boolean = false;

  learningMethodsData = {
    labels:this.labels,
    datasets: [
      {
        label: "Select Semeters",
        data: this.data,
        backgroundColor: "rgba(0,0,255)",
        barThickness: 25
      }
    ]
  }

  constructor(private backendSvc: BackendCommunicationService) {}


  ngOnInit() {
    this.loading = true;
    this.initializeData();
  }

  initializeData() {
    this.backendSvc.getLearningMethods().subscribe(response => {
        this.loading = false;
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
    let graphLabel = '';
    this.selectedsemesters.forEach((semester:any) => {
      graphLabel += " " + semester?.name + "-" + semester?.semester + "-" + semester?.year + ",";
    });
    if (graphLabel.charAt(graphLabel.length - 1) === ',') {
      graphLabel = graphLabel.slice(0, graphLabel.lastIndexOf(','));
    }
    if (graphLabel.trim() === '') {
      graphLabel = 'Select Semesters'
    }
    this.learningMethodsData.datasets[0].label = graphLabel;
    this.updateGraphData();
    this.chart.update();
  }

  isSelected(semester:any) {
    if (this.selectedsemesters.includes(semester)) {
      return true;
    } else {
      return false;
    }
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

  downloadPDF() {
    const canvas = document.getElementById('learning_methods_graph') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // Save the current state
    ctx.save();
    // Set the canvas background color to white
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasImage = canvas.toDataURL('image/jpeg', 1.0);
    ctx.restore();

    const pdf = new jsPDF('landscape');
    pdf.setFontSize(16);
    pdf.addImage(canvasImage, 'JPEG', 10, 15, 270, 140);
    pdf.save('Learning Methods');

    // Setting color back to the normal background
    ctx.fillStyle = 'rgba(198, 226, 226, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
