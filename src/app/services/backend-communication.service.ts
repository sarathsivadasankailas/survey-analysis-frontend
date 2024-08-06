import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { DataProcessorService } from './data-processor.service';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {

  hostName = 'https://survey-analysis-backend.onrender.com';

  constructor(private http: HttpClient, private dataProcessorSvc: DataProcessorService) { }

  getLearningMethods() {
    let api = this.hostName + '/api/learning-methods';
    return this.http.get(api).pipe(
      map(data => {
        return this.dataProcessorSvc.getLearningMethods(data);
      })
    )
  }

  createLearningMethods(requestBody: any) {
    let api = this.hostName + '/api/learning-methods';
    return this.http.post(api, requestBody);
  }

  deleteLearningsMethod(id:any) {
    let api = `${this.hostName}/api/learning-methods/${id}`;
    return this.http.delete(api);
  }

  getTechniquesAdopted() {
    let api = this.hostName + '/api/technologies-adopted';
    return this.http.get(api).pipe(
      map(data => {
        return this.dataProcessorSvc.getTechniquesAdopted(data);
      })
    )
  }

  createTechniquesAdopted(requestBody: any) {
    let api = this.hostName + '/api/technologies-adopted';
    return this.http.post(api, requestBody);
  }

  deleteTechniquesAdopted(id:any) {
    let api = `${this.hostName}/api/technologies-adopted/${id}`;
    return this.http.delete(api);
  }
}
