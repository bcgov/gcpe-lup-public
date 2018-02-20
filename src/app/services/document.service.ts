import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/observable/forkJoin';

import { ApiService } from './api';
// import { Search, SearchArray, SearchTerms } from 'app/models/search';
import { Document } from 'app/models/document';
// import { Application } from 'app/models/application';
// import { Proponent } from 'app/models/proponent';

@Injectable()
export class DocumentService {
  // searchResult: SearchArray;

  constructor(private api: ApiService) { }

  // get all documents for the specified application id
  getAllByApplicationId(appId: string): Observable<Document[]> {
    return this.api.getDocumentsByAppId(appId)
      .map((res: Response) => {
        const documents = res.text() ? res.json() : [];
        documents.forEach((document, i) => {
          documents[i] = new Document(document);
        });
        return documents;
      })
      .catch(this.api.handleError);
  }

  // get all documents for the specified comment
  getAllByCommentId(commentId: string): Observable<Document[]> {
    return this.api.getDocumentsByCommentId(commentId)
      .map((res: Response) => {
        const documents = res.text() ? res.json() : [];
        documents.forEach((document, i) => {
          documents[i] = new Document(document);
        });
        return documents;
      })
      .catch(this.api.handleError);
  }

  // get all documents for the specified decision
  getAllByDecisionId(decisionId: string): Observable<Document[]> {
    return this.api.getDocumentsByDecisionId(decisionId)
      .map((res: Response) => {
        const documents = res.text() ? res.json() : [];
        documents.forEach((document, i) => {
          documents[i] = new Document(document);
        });
        return documents;
      })
      .catch(this.api.handleError);
  }

  // get a specific document by its id
  getById(documentId): Observable<Document> {
    return this.api.getDocument(documentId)
      .map((res: Response) => {
        const document = res.text() ? res.json() : [];
        // return the first (only) document
        return document.length > 0 ? new Document(document[0]) : null;
      })
      .catch(this.api.handleError);
  }

  // returns a promise
  // alternately, use first()
  // ref: https://stackoverflow.com/questions/36777284/angular-2-convert-observable-to-promise
  upload(formData: Object): Promise<Document> {
    return this.api.uploadDocument(formData)
      .map((res: Response) => {
        const documents = res.text() ? res.json() : null;
        // return documents.length > 0 ? new Document(documents[0]) : null;
        return documents;
      })
      .toPromise()
      .catch(this.api.handleError);
  }

  // get(terms: SearchTerms, applications: Array<Application>, proponents: Array<Proponent>, page: number, limit: number) {
  //   this.searchResult = new SearchArray();

  //   let query = 'search?types=document';
  //   let memProjectQuery = '';
  //   let epicProjectQuery = '';

  //   // Paging
  //   query += '&page=' + page + '&limit=' + limit;

  //   const params = terms.getParams();

  //   // Get the keywords
  //   if (params['keywords']) {
  //     query += '&search=' + params['keywords'];
  //   }

  //   // We change the way we query epic because the only thing we're currently in
  //   // for api/applications/major is the epicCode.  In future we'll be able to change
  //   // this to reference project= in epic.
  //   if (params['applications']) {
  //     const epicQuery = [];
  //     terms.applications.forEach(p => {
  //       p.epicProjectCodes.forEach(c => {
  //         epicQuery.push(c);
  //       });
  //     });
  //     memProjectQuery += '&project=' + params['applications'];
  //     epicProjectQuery += '&projectcode=' + epicQuery;
  //   } else {
  //     // Make sure we query all the applications by default
  //     const projectQuery = [];
  //     const epicQuery = [];
  //     applications.forEach(p => {
  //       projectQuery.push(p._id);
  //       p.epicProjectCodes.forEach(c => {
  //         epicQuery.push(c);
  //       });
  //     });
  //     memProjectQuery += '&project=' + projectQuery;
  //     epicProjectQuery += '&projectcode=' + epicQuery;
  //   }

  //   if (params['proponents']) {
  //     // EPIC needs the string name for proponent, not the objectID
  //     memProjectQuery += '&proponent=' + params['proponents'];

  //     const proponentQ = [];

  //     const props = params['proponents'].split(',');
  //     props.forEach(prop => {
  //       proponents.forEach(p => {
  //         if (p._id === prop) {
  //           // If the AKA field is set, use that - otherwise use the company name
  //           if (p.alsoKnownAs && p.alsoKnownAs !== '') {
  //             proponentQ.push(p.alsoKnownAs);
  //           } else {
  //             proponentQ.push(p.company);
  //           }
  //         }
  //       });
  //     });
  //     if (proponentQ.length > 0) {
  //       epicProjectQuery += '&proponentstring=' + proponentQ;
  //     }
  //   }
  //   if (params['ownerships']) {
  //     // MEM/EPIC needs the string name for ownership, not the objectID

  //     const ownershipQ = [];

  //     const owns = params['ownerships'].split(',');
  //     owns.forEach(prop => {
  //       proponents.forEach(p => {
  //         if (p._id === prop) {
  //           // If the AKA field is set, use that - otherwise use the company name
  //           if (p.alsoKnownAs && p.alsoKnownAs !== '') {
  //             ownershipQ.push(p.alsoKnownAs);
  //           } else {
  //             ownershipQ.push(p.company);
  //           }
  //         }
  //       });
  //     });
  //     if (ownershipQ.length > 0) {
  //       // EPIC doesn't store ownership data right now, search as though we're setting
  //       // the owner/proponent field - remake the prop string to include the specific
  //       // results for EPIC.
  //       if (false === epicProjectQuery.includes('&proponentstring=')) {
  //         epicProjectQuery += '&proponentstring=' + ownershipQ;
  //       } else {
  //         // Tack it on the end
  //         epicProjectQuery += ',' + ownershipQ;
  //       }
  //       memProjectQuery += '&ownership=' + params['ownerships'];
  //     }
  //   }
  //   if (params['datestart']) {
  //     query += '&datestart=' + params['datestart'];
  //   }
  //   if (params['dateend']) {
  //     query += '&dateend=' + params['dateend'];
  //   }

  //   // Field selection
  //   query += '&fields=_id application displayName documentDate description datePosted \
  //   documentCategories collections keywords inspectionReport';
  //   const mem = this.api.getMEM(`v2/${query}${memProjectQuery}`)
  //     .map((res: Response) => {
  //       const data = res.text() ? res.json() : { count: 0, results: [] };
  //       if (data.results) {
  //         data.results.forEach(i => {
  //           i.hostname = this.api.hostnameMEM;
  //         });
  //       }
  //       return data;
  //     });
  //   const epic = this.api.getEPIC(`v3/${query}${epicProjectQuery}`)
  //     .map((res: Response) => {
  //       const data = res.text() ? res.json() : { count: 0, results: [] };
  //       if (data.results) {
  //         data.results.forEach(i => {
  //           i.hostname = this.api.hostnameEPIC;
  //         });
  //       }
  //       return data;
  //     });

  //   // execute in parallel
  //   return Observable.forkJoin([mem, epic]);
  // }
}
