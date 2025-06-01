import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class PaginatorService {
  private missionAnnouncedSource = new Subject<string>();

  missionAnnounced$ = this.missionAnnouncedSource.asObservable();

  constructor() {}

  getPageLoad(loadItem: any) {
    this.missionAnnouncedSource.next(loadItem);
  }

  clearPageLoad() {
    this.missionAnnouncedSource.next(null);
  }
}
