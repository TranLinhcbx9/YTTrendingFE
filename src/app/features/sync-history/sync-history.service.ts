import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '@env/environment';
import { PagedResult } from '@shared/models/paged-result';
import { SyncRun, SyncRunItem, SyncRunItemStatus, SyncRunsFilter } from './sync-history.models';

@Injectable({ providedIn: 'root' })
export class SyncHistoryService {
  private readonly http = inject(HttpClient);
  private readonly jobsUrl = `${environment.apiBaseUrl}/jobs`;
  private readonly syncUrl = `${this.jobsUrl}/sync`;

  createSyncRun(): Promise<SyncRun> {
    return firstValueFrom(this.http.post<SyncRun>(this.syncUrl, null));
  }

  getSyncRuns(
    params: { page: number; pageSize: number } & SyncRunsFilter,
  ): Observable<PagedResult<SyncRun>> {
    let httpParams = new HttpParams().set('page', params.page).set('pageSize', params.pageSize);

    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.source) httpParams = httpParams.set('source', params.source);
    if (params.timeRangeInDays) {
      httpParams = httpParams.set('timeRangeInDays', params.timeRangeInDays);
    }
    if (params.from && params.to) {
      httpParams = httpParams.set('from', params.from).set('to', params.to);
    }

    return this.http.get<PagedResult<SyncRun>>(this.jobsUrl, { params: httpParams });
  }

  getSyncRun(id: number): Observable<SyncRun> {
    return this.http.get<SyncRun>(`${this.syncUrl}/${id}`);
  }

  getSyncRunItems(params: {
    runId: number;
    page: number;
    pageSize: number;
    status?: SyncRunItemStatus;
  }): Observable<PagedResult<SyncRunItem>> {
    let httpParams = new HttpParams().set('page', params.page).set('pageSize', params.pageSize);
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<PagedResult<SyncRunItem>>(`${this.syncUrl}/${params.runId}/items`, {
      params: httpParams,
    });
  }
}
