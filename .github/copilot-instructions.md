# UrAgenda Frontend - AI Agent Instructions

## Project Overview
**UrAgenda** is an Angular 19 scheduling/booking application (Portuguese: "ur-agenda" = "your schedule"). The frontend manages appointment booking workflows with form submission and listing views.

## Architecture & Structure

### Module Organization
The project follows **traditional Angular module architecture** (non-standalone components):

- **`src/app/core/`** - Shared components & services (e.g., NavbarComponent)
- **`src/app/modules/`** - Feature modules with lazy loading capability (e.g., AppointmentsModule)
  - Each feature module has its own routing (`appointments-routing.module.ts`)
  - Declares page components internally (in `pages/` subfolder)

### Current State
The **foundation is laid but incomplete**:
- Module structure exists for `appointments` feature (scheduling)
  - `AppointmentsListComponent` - displays bookings
  - `AppointmentsFormComponent` - creates/edits bookings
- **No data layer yet**: services, models, HTTP integration, or state management
- App routing is empty; feature module routing needs configuration
- Navbar exists but is not integrated

## Key Conventions

### Style & Build
- **Stylesheet Language**: SCSS (configured in `angular.json`)
- **Component Prefix**: `app` (e.g., `<app-navbar>`)
- **Build Output**: `dist/ur-agenda/`

### Components (Non-Standalone)
All components use the **module-based declaration** pattern:
```typescript
// Component definition
@Component({
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  styleUrl: './feature-name.component.scss',
  standalone: false  // Always false
})
export class FeatureNameComponent { }

// Module declaration
@NgModule({
  declarations: [FeatureNameComponent],
  imports: [CommonModule],
  exports: [FeatureNameComponent]  // If shared
})
export class FeatureModule { }
```

### Testing
Tests use **Jasmine + Karma**. Example pattern:
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentName]
    }).compileComponents();
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Development Workflows

### Common Commands
- **Development Server**: `npm start` or `ng serve` → http://localhost:4200
- **Unit Tests**: `npm test` or `ng test` (runs Karma in watch mode)
- **Production Build**: `npm build` or `ng build` → outputs to `dist/`
- **Code Generation**: `ng generate component path/component-name` (auto-creates component with SCSS & spec)

### TypeScript Strict Mode
Project enforces strict TypeScript:
- `noImplicitAny`, `strictNullChecks`, `strictPropertyInitialization` enabled
- `strictTemplates: true` in Angular compiler options
- All properties/return types must be explicitly typed

## Where to Add New Functionality

### Adding Features
1. **Feature Module**: Create in `src/app/modules/feature-name/`
   ```
   feature-name/
   ├── feature-name.module.ts
   ├── feature-name-routing.module.ts
   └── pages/
       ├── list/
       └── form/
   ```
2. **Add Routes**: Update `feature-name-routing.module.ts` with component routes
3. **Import in App**: Add to `AppRoutingModule.imports` to enable lazy loading

### Adding Shared Components
- Place in `src/app/core/components/`
- Export from `CoreModule`
- Import CoreModule in feature modules that need it

### Adding Services
Create in `src/app/core/services/` (central location):
```typescript
@Injectable({
  providedIn: 'root'  // Tree-shakeable
})
export class AppointmentsService {
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/appointments');
  }
}
```

### Adding Models/Interfaces
Create in `src/app/core/models/`:
```typescript
// src/app/core/models/appointment.model.ts
export interface Appointment {
  id: number;
  dateTime: Date;
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

### Example: Implementing Appointments Feature
1. **Update routing** in `appointments-routing.module.ts`:
   ```typescript
   const routes: Routes = [
     { path: '', component: AppointmentsListComponent },
     { path: 'new', component: AppointmentsFormComponent }
   ];
   ```
2. **Create model** in `src/app/core/models/appointment.model.ts`
3. **Create service** in `src/app/core/services/appointments.service.ts` with HTTP calls
4. **Inject service** into list/form components, use `async` pipe in templates
5. **Add ReactiveFormsModule** to `appointments.module.ts`

## Integration Points & Best Practices

### HTTP/API Integration (Recommended Pattern)
Use **HttpClientModule** with dedicated services:
```typescript
// src/app/core/services/appointments.service.ts
@Injectable({ providedIn: 'root' })
export class AppointmentsService {
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>('/api/appointments');
  }
  
  create(data: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>('/api/appointments', data);
  }
}
```
- Inject into components, subscribe in templates with `async` pipe
- Plan for HTTP interceptors (error handling, auth headers) later

### Forms (Recommended: ReactiveFormsModule)
Use **reactive forms** for better control and testing:
```typescript
// In appointments.module.ts, add to imports:
imports: [CommonModule, ReactiveFormsModule, AppointmentsRoutingModule]

// In component:
constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    dateTime: ['', Validators.required],
    description: ['']
  });
}
```
- Provides type-safe form validation
- Better for complex forms and testing

### State Management (Recommended: Service-Based Observable Pattern)
Start simple with services + RxJS Subjects:
```typescript
@Injectable({ providedIn: 'root' })
export class AppointmentsStateService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSubject.asObservable();
  
  loadAppointments() {
    this.appointmentsService.getAll().subscribe(data => 
      this.appointmentsSubject.next(data)
    );
  }
}
```
- Simpler than NgRx for current project size
- Scales well; can migrate to NgRx later if needed

### Navigation (Recommended: Router Integration)
Update routing and navbar:
```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: 'appointments', loadChildren: () => import('./modules/appointments/appointments.module').then(m => m.AppointmentsModule) }
];

// navbar.component.ts - add RouterTestingModule for testing
constructor(private router: Router) {}
navigateTo(path: string) { this.router.navigate([path]); }
```

### Development Dependencies
- TypeScript 5.7.2 (strict mode)
- Jasmine 5.6 + Karma 6.4 (testing)
- Angular CLI 19.2.15 (code generation & builds)

## Quick Tips for AI Agents

1. **Always respect strict TypeScript** - all types must be explicit
2. **Component files are linked triplets**: `.ts`, `.html`, `.scss` (and `.spec.ts` for tests)
3. **Run tests after component creation**: `npm test` to verify spec wiring
4. **Module imports matter**: If a component needs CommonModule, FormsModule, etc., import in the declaring module—not the component
5. **The appointments pages are the main feature**: Focus development here; Navbar is a shell
6. **No API client yet**: Model data structures first; integration comes later

## References
- Angular Docs: https://angular.dev
- Angular CLI: https://angular.dev/tools/cli
- Current main components: [app.module.ts](src/app/app.module.ts), [appointments.module.ts](src/app/modules/appointments/appointments.module.ts)
