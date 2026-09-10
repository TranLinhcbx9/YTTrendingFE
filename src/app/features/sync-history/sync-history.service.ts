import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '@env/environment';
import { PagedResult } from '@shared/models/paged-result';
import { SyncRun, SyncRunItem, SyncRunItemStatus } from './sync-history.models';

@Injectable({ providedIn: 'root' })
export class SyncHistoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/jobs/sync`;

  createSyncRun(): Promise<SyncRun> {
    return firstValueFrom(this.http.post<SyncRun>(this.baseUrl, null));
  }

  getSyncRun(id: number): Observable<SyncRun> {
    return this.http.get<SyncRun>(`${this.baseUrl}/${id}`);
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

    return this.http.get<PagedResult<SyncRunItem>>(`${this.baseUrl}/${params.runId}/items`, {
      params: httpParams,
    });
  }
}
