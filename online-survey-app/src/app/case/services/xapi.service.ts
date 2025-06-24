import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IndexedDBService } from './indexdb.service';

@Injectable({
  providedIn: 'root'
})
export class XapiService {

  constructor(private http: HttpClient, private dbService: IndexedDBService) { }

  private getHeaders(auth: string): HttpHeaders {
    console.log('Using auth:', btoa(auth), JSON.parse(auth)[0]);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(JSON.parse(auth)[0])
    });
  }

  buildXapiStatementFromForm(
  result: Record<string, any>,
  actor: Record<string, any>,
  activityId: string,
  activityName: string,
  activityDesc: string,
  lang: string,
  lrsEndpointUrl: string
): any {
  const statement = {
    actor: actor,
    verb: {
      id: 'http://adlnet.gov/expapi/verbs/completed',
      display: { [lang]: 'completed' }
    },
    object: {
      id: activityId,
      objectType: 'Activity',
      definition: {
        name: { [lang]: activityName },
        description: { [lang]: activityDesc }
      }
    },
    result: {...result},
    context: {
      extensions: {
        [`${lrsEndpointUrl}/survey`]: result.formData
      }
    },
    timestamp: new Date().toISOString()
  };

  return statement;
  }


  async sendStatement(statement: any, auth: string, lrsEndpointUrl:string): Promise<void> {
    const headers = this.getHeaders(auth);
     if (navigator.onLine) {
      try {
        await this.http.post(lrsEndpointUrl + "/statements", statement, { headers }).toPromise();
      } catch (err) {
        console.warn('Failed to send, saving offline', err);
        await this.dbService.addStatement(statement);
      }
    } else {
      await this.dbService.addStatement(statement);
    }
  };

  async syncStoredStatements(lrsEndpointUrl:string, auth:string): Promise<void> {
    const storedStatements = await this.dbService.getAllStatements();
    const headers = this.getHeaders(auth);
    const successfullySyncedIds: number[] = [];

    for (const record of storedStatements) {
      try {
        await this.http.post(lrsEndpointUrl, record.data, { headers }).toPromise();
        successfullySyncedIds.push(record.id);
      } catch (err) {
        console.error('Failed to sync a statement', err);
        break;
      }
    }

    if (successfullySyncedIds.length > 0) {
      await this.dbService.deleteStatementsByIds(successfullySyncedIds);
    } else {
      console.log('No statements were synced.');
    }
  }
}