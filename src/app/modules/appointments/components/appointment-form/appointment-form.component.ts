import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appointment } from '../../../../core/models/appointment.model';
import { AppointmentsService } from '../../services/appointments.service';
import { ProfessionalService } from '../../../../core/services/professional.service';
import { BusinessService } from '../../../../core/services/business.service';
import { ServiceService } from '../../../../core/services/service.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './appointment-form.component.html',
    styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit, OnChanges {
    @Input() visible = false;
    @Input() appointment: Appointment | null = null;
    @Input() preselectedDate: string | null = null; // for creation from calendar click

    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    form: FormGroup;
    loading = false;
    saving = false;

    professionals: any[] = [];
    businesses: any[] = [];
    services: any[] = [];
    customers: any[] = [];

    constructor(
        private fb: FormBuilder,
        private appointmentsService: AppointmentsService,
        private professionalService: ProfessionalService,
        private businessService: BusinessService,
        private serviceService: ServiceService,
        private customerService: CustomerService
    ) {
        this.form = this.fb.group({
            id: [null],
            userId: [null, Validators.required],
            professionalId: [null, Validators.required],
            serviceId: [null, Validators.required],
            businessId: [null, Validators.required],
            date: [null, Validators.required], // Date part
            startTime: [null, Validators.required], // Time part
            endTime: [null, Validators.required], // Time part
            status: ['PENDING', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDropdownData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            if (this.appointment) {
                this.patchForm(this.appointment);
            } else {
                this.resetForm();
                if (this.preselectedDate) {
                    this.form.patchValue({
                        date: this.preselectedDate
                    });
                }
            }
        }
    }

    loadDropdownData() {
        this.loading = true;
        // Load all data in parallel usually, simplified here
        this.professionalService.getAllProfessionals().subscribe(data => this.professionals = data?.content || []);
        this.businessService.getAllBusinesses().subscribe(data => this.businesses = data?.content || []);
        this.serviceService.getAllServices().subscribe(data => this.services = data?.content || []);
        this.customerService.getAllCustomers().subscribe(data => this.customers = data?.content || []);
        this.loading = false;
    }

    patchForm(appointment: Appointment) {
        const start = new Date(appointment.startTime);
        const end = new Date(appointment.endTime);

        this.form.patchValue({
            id: appointment.id,
            userId: appointment.userDTO?.id,
            professionalId: appointment.professionalDTO?.id,
            serviceId: appointment.serviceDTO?.id,
            businessId: appointment.businessDTO?.id,
            date: start.toISOString().split('T')[0],
            startTime: start.toTimeString().substring(0, 5),
            endTime: end.toTimeString().substring(0, 5),
            status: appointment.status
        });
    }

    resetForm() {
        this.form.reset({
            status: 'PENDING'
        });
    }

    onSave() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;
        const value = this.form.value;

        // Combine Date + Time to ISO Instant
        const startIso = new Date(`${value.date}T${value.startTime}:00`).toISOString();
        const endIso = new Date(`${value.date}T${value.endTime}:00`).toISOString();

        const payload = {
            clientId: value.userId, // Controller expects clientId
            professionalId: value.professionalId,
            serviceId: value.serviceId,
            businessId: value.businessId,
            startTime: startIso,
            endTime: endIso,
            // price: 0, // Backend logic?
            status: value.status
        };

        if (value.id) {
            this.appointmentsService.update(value.id, payload)
                .pipe(finalize(() => this.saving = false))
                .subscribe({
                    next: () => {
                        this.saved.emit();
                        this.close.emit();
                    },
                    error: (err) => alert('Erro ao atualizar: ' + (err.message || 'Desconhecido'))
                });
        } else {
            this.appointmentsService.create(payload)
                .pipe(finalize(() => this.saving = false))
                .subscribe({
                    next: () => {
                        this.saved.emit();
                        this.close.emit();
                    },
                    error: (err) => alert('Erro ao criar: ' + (err.message || 'Desconhecido'))
                });
        }
    }

    onCancel() {
        this.close.emit();
    }
}
