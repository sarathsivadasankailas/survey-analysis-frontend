import { Injectable } from '@angular/core';
import { BackendCommunicationService } from './backend-communication.service';

@Injectable({
  providedIn: 'root'
})
export class DataProcessorService {

  learningMethods: any;

  constructor() { }

  getLearningMethods(data: any) {
    let classes: any[] = [];
    let learningMethodLabels: any[] = [];
    let learningMethodValues = [];
    data.forEach((semester:any) => {
      let semesterName = {
        name: semester?.name,
        year: semester?.year,
        semester: semester?.semester
      }
      classes.push(semesterName);
      let methods = semester?.methods;
      if (methods) {
        methods.forEach((method:any) => {
          let methodName = method?.method;
          if (!learningMethodLabels.includes(methodName)) {
            learningMethodLabels.push(methodName);
          }
        })
      }
    });

    let response = {
      classes: classes,
      labels: learningMethodLabels,
      responseData: data
    }

    return response;
  }
}
