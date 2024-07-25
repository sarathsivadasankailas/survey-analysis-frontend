import { Component } from '@angular/core';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private backendSvc: BackendCommunicationService) {}

  fileName: string = '';
  message: string = '';
  success: boolean = false;
  error: boolean = false;
  learningMethodsReq: any;
  enableUpload: boolean = false;
  uploadText: string = '';

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

  onDownloadTechnologiesAdopted() {
    window.open('../../../assets/templates/TechnologiesAdopted.xlsx')
  }

  onDownloadLearningMethods() {
    window.open('../../../assets/templates/LearningMethods.xlsx')
  }

  reset() {
    this.success = false;
    this.error = false;
    this.message = '';
    this.learningMethodsReq = undefined;
    this.enableUpload = false;
    this.uploadText = '';
  }

  onFileSelect(event: any) {
    this.reset();
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length === 0) {
      this.fileName = "No file Selected";
    }
    if (target.files.length > 1)  {
      this.message = "Cannot select multiple files";
      this.error = true;
      return;
    }
    const file = target.files[0];
    this.fileName = file.name;
    const fileExtension = this.fileName.slice((this.fileName.lastIndexOf('.') - 1 >>> 0) + 2);
    if (fileExtension !== 'xlsx') {
      this.message = 'Selected file is not an xlsx. Please select a valid xlsx file.';
      this.error = true;
      return;
    }
    this.readFile(file);
  }

  readFile(file: any) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      if (wsname === 'LearningMethods') {
        this.readLearningMethods(wb);
      } else if (wsname === 'TechnologiesAdopted') {
        this.readTechnologiesAdopted(wb);
      } else {
        this.message = 'Invalid xlsx file. Cannot find worksheets with names LearningMethods or TechnologiesAdopted';
        this.error = true;
        return;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  readTechnologiesAdopted(wb: any) {

  }

  readLearningMethods(wb: any) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    let name = ws['A3'] ? ws['A3'].v : undefined;
    let semester = ws['B3'] ? ws['B3'].v : undefined;
    let year = ws['C3'] ? ws['C3'].v : undefined;

    let methods: any = [];

    console.log(ws);
    let str = ws['!ref'];
    if (str !== null && str !== undefined) {
      const range = utils.decode_range(str);
      for (let rowNum = 3; rowNum <= range.e.r; rowNum++) {
        // Read learning method Column E
        const learningMethodsCellAddr = { c: 4, r: rowNum };
        const learningMethodsRef = utils.encode_cell(learningMethodsCellAddr);
        const learningMethod = ws[learningMethodsRef] ? ws[learningMethodsRef].v : '';

        let scores: any = [];
        // Read Ratings
        for (let colNum = 5; colNum <=9; colNum++ ) {
          const ratingCellAddr = { c: colNum, r: rowNum };
          const ratingCellRef = utils.encode_cell(ratingCellAddr);
          const rating = ws[ratingCellRef] ? ws[ratingCellRef].v : '';
          scores.push(rating);
        }
        methods.push({method : learningMethod, scores: scores});
      }
      this.learningMethodsReq = {
        name: name,
        semester: semester,
        year: year,
        methods: methods
      }
      this.uploadText = 'Upload Learning Methods';
      this.enableUpload = true;
    } else {
      this.message = "Some error happened while parsing the xlsx. Please try to load again";
      this.error = true;
    }
  }

  uploadFile() {
    if (this.uploadText === 'Upload Learning Methods') {
      this.uploadLearningMethods();
    }
  }

  uploadLearningMethods() {
    if (this.learningMethodsReq !== null && this.learningMethodsReq !== undefined) {
      this.backendSvc.createLearningMethods(this.learningMethodsReq).subscribe((response:any) => console.log(response));
    }
  }
}
