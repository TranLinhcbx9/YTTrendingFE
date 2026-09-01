import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

/** Debounce input tự gõ (search/số) trước khi đẩy vào filter gọi API — tránh 1 request/keystroke. */
export function toDebouncedSignal<T>(source: Signal<T>, ms: number): Signal<T> {
  return toSignal(toObservable(source).pipe(debounceTime(ms)), { initialValue: source() });
}
