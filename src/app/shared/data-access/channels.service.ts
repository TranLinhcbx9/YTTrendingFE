import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '@env/environment';
import { Channel } from '@shared/models/channel';
import { PagedResult } from '@shared/models/paged-result';

export function extractYoutubeHandle(input: string): string {
  const trimmed = input.trim();

  if (!/youtube\.com|youtu\.be/i.test(trimmed)) {
    return trimmed.replace(/^@/, '');
  }

  const segments = trimmed.split('?')[0].split('/').filter(Boolean);

  return segments[segments.length - 1]?.replace(/^@/, '') ?? trimmed;
}

@Injectable({ providedIn: 'root' })
export class ChannelsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/channels`;

  getChannels(params: { page: number; pageSize: number }): Observable<PagedResult<Channel>> {
    const httpParams = new HttpParams().set('page', params.page).set('pageSize', params.pageSize);
    return this.http.get<PagedResult<Channel>>(this.baseUrl, { params: httpParams });
  }

  createChannel(youtubeHandle: string): Promise<Channel> {
    return firstValueFrom(this.http.post<Channel>(this.baseUrl, { youtubeHandle }));
  }

  updateChannel(id: number, body: { name: string; url: string; isEnabled: boolean }): Promise<Channel> {
    return firstValueFrom(this.http.put<Channel>(`${this.baseUrl}/${id}`, { id, ...body }));
  }

  deleteChannel(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
