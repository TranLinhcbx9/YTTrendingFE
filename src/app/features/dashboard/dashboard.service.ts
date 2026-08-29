import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { PagedResult } from '@shared/models/paged-result';
import { Video, VideoStatus } from '@shared/models/video';

/** Filter của `GET /api/videos` — khớp `VideoFilter` backend (`ChannelIds`/`Status`). */
export interface VideoListFilter {
  channelIds?: number[];
  status?: VideoStatus;
}

/**
 * Tầng gọi API `/api/videos`. Đặt tên theo tài nguyên (không phải
 * `DashboardService`) vì các tab sau (Trending/Fast Growing/Saved) cũng gọi
 * cùng endpoint này.
 */
@Injectable({ providedIn: 'root' })
export class VideosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/videos`;

  getVideos(
    params: { page: number; pageSize: number } & VideoListFilter,
  ): Observable<PagedResult<Video>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);

    // `append` chứ không phải `set`: nhiều kênh = lặp lại key
    // (`channelIds=1&channelIds=2`), `set` sẽ ghi đè chỉ còn 1 giá trị.
    for (const channelId of params.channelIds ?? []) {
      httpParams = httpParams.append('channelIds', channelId);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<PagedResult<Video>>(this.baseUrl, { params: httpParams });
  }
}
