import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private isExpandedSubject = new BehaviorSubject<boolean>(true);
    isExpanded$ = this.isExpandedSubject.asObservable();

    constructor() { }

    toggle(): void {
        this.isExpandedSubject.next(!this.isExpandedSubject.value);
    }

    setExpanded(isExpanded: boolean): void {
        this.isExpandedSubject.next(isExpanded);
    }
}
