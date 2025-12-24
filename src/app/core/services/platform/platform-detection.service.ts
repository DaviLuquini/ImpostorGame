import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlatformDetectionService {
    isMobile = signal(this.checkMobile());
    isTablet = signal(this.checkTablet());
    isDesktop = signal(this.checkDesktop());
    isTouchDevice = signal(this.checkTouch());

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => this.updatePlatform());
        }
    }

    private updatePlatform(): void {
        this.isMobile.set(this.checkMobile());
        this.isTablet.set(this.checkTablet());
        this.isDesktop.set(this.checkDesktop());
    }

    private checkMobile(): boolean {
        return typeof window !== 'undefined' && window.innerWidth < 768;
    }

    private checkTablet(): boolean {
        return typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    }

    private checkDesktop(): boolean {
        return typeof window !== 'undefined' && window.innerWidth >= 1024;
    }

    private checkTouch(): boolean {
        return typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
}
