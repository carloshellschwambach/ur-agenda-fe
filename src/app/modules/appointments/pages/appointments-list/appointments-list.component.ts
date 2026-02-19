import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointments-list',
  standalone: false,
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.scss'
})
export class AppointmentsListComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  modalVisible = false;
  selectedAppointment: Appointment | null = null;
  selectedDate: string | null = null;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true, // Allow drag/drop? Need backend implementation
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
      list: 'Lista'
    },
    // Custom render for day cells
    dayCellContent: (arg: any) => {
      return {
        html: `
          <div class="day-cell-content">
            <span class="day-number">${arg.dayNumberText}</span>
            <div class="new-appointment-label">+ Novo agendamento</div>
          </div>
        `
      };
    },
    dateClick: (arg: any) => this.handleDateClick(arg),
    eventClick: (arg: any) => this.handleEventClick(arg),
    // Fetch events from API
    events: (info, successCallback, failureCallback) => {
      this.appointmentsService.getAppointments(0, 1000).subscribe({
        next: (page) => {
          const events = page.content.map(appointment => ({
            id: appointment.id,
            title: this.getEventTitle(appointment),
            start: appointment.startTime,
            end: appointment.endTime,
            extendedProps: {
              appointment: appointment
            },
            backgroundColor: this.getStatusColor(appointment.status),
            borderColor: this.getStatusColor(appointment.status),
            textColor: '#ffffff'
          }));
          successCallback(events);
        },
        error: (error) => {
          console.error('Error fetching appointments', error);
          if (failureCallback) failureCallback(error);
        }
      });
    }
  };

  constructor(
    private sidebarService: SidebarService,
    private appointmentsService: AppointmentsService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // Resize calendar when sidebar toggles
    this.sidebarService.isExpanded$.subscribe(() => {
      setTimeout(() => {
        if (this.calendarComponent) {
          this.calendarComponent.getApi().updateSize();
        }
      }, 300); // 300ms to match sidebar transition duration
    });
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.selectedAppointment = null;
    this.modalVisible = true;
  }

  handleEventClick(arg: any) {
    const event = arg.event;
    this.selectedAppointment = event.extendedProps.appointment;
    this.selectedDate = null;
    this.modalVisible = true;
  }

  onModalClose() {
    this.modalVisible = false;
    this.selectedAppointment = null;
    this.selectedDate = null;
  }

  onModalSaved() {
    this.modalVisible = false;
    this.refreshCalendar();
  }

  refreshCalendar() {
    if (this.calendarComponent) {
      this.calendarComponent.getApi().refetchEvents();
    }
  }

  private getEventTitle(appointment: any): string {
    const service = appointment.serviceDTO?.name || 'Serviço';
    const client = appointment.userDTO?.name || 'Cliente';
    // Shorten title for month view
    // return `${service.substring(0, 10)}.. - ${client}`;
    return `${service} - ${client}`;
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'var(--color-success, #4caf50)';
      case 'PENDING': return 'var(--color-warning, #ff9800)';
      case 'CANCELED': return 'var(--color-error, #f44336)';
      case 'COMPLETED': return 'var(--color-info, #2196f3)';
      default: return 'var(--color-primary, #3f51b5)';
    }
  }
}
