import { Component, inject, ChangeDetectorRef, ChangeDetectionStrategy, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@services/notification.service';
import { InternalToast } from '@models/index';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnDestroy {
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  toasts: InternalToast[] = [];

  // default duration in ms when not provided by the toast
  readonly defaultDuration = 5000;

  private timers = new Map<number, ReturnType<typeof setInterval>>();

  constructor() {
    // Utilise effect() pour réagir aux changements du signal toasts
    effect(() => {
      const toasts = this.notificationService.toasts();
      
      // initialize internal fields for progress tracking
      this.clearTimers();
      this.toasts = toasts.map(t => ({ 
        ...t, 
        progress: 100, 
        startedAt: Date.now(), 
        remaining: t.duration ?? this.defaultDuration, 
        paused: false 
      }));
      this.startAllTimers();
      this.cdr.markForCheck();
    });
  }

  remove(id: number): void {
    this.notificationService.remove(id);
  }

  trackById(index: number, item: InternalToast): number {
    return item.id;
  }

  private startAllTimers(): void {
    for (const t of this.toasts) {
      this.startTimerFor(t);
    }
  }

  private startTimerFor(t: InternalToast): void {
    if (this.timers.has(t.id)) return;
    const total = t.remaining ?? this.defaultDuration;
    t.startedAt = Date.now();
    const started = Date.now();
    const tick = () => {
      if (t.paused) return;
      const elapsed = Date.now() - (t.startedAt || started);
      const rem = Math.max((t.remaining ?? total) - elapsed, 0);
      t.progress = Math.round((rem / (t.remaining ?? total)) * 100);
      if (rem <= 0) {
        this.remove(t.id);
        this.clearTimer(t.id);
      }
      this.cdr.markForCheck();
    };
    this.timers.set(t.id, setInterval(tick, 200));
  }

  private clearTimer(id: number): void {
    const h = this.timers.get(id);
    if (h) {
      clearInterval(h);
      this.timers.delete(id);
    }
  }

  private clearTimers(): void {
    for (const h of this.timers.values()) clearInterval(h);
    this.timers.clear();
  }

  // pause / resume on hover handlers called from template via events
  onPause(id: number): void {
    const t = this.toasts.find(x => x.id === id);
    if (!t || t.paused) return;
    t.paused = true;
    // compute remaining
    const elapsed = Date.now() - (t.startedAt ?? Date.now());
    t.remaining = Math.max((t.remaining ?? this.defaultDuration) - elapsed, 0);
    this.clearTimer(id);
    this.cdr.markForCheck();
  }

  onResume(id: number): void {
    const t = this.toasts.find(x => x.id === id);
    if (!t || !t.paused) return;
    t.paused = false;
    t.startedAt = Date.now();
    this.startTimerFor(t);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }
}
