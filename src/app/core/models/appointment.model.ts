export interface Appointment {
    id: string;
    userDTO: UserDTO;
    professionalDTO: ProfessionalDTO;
    serviceDTO: ServiceDTO;
    businessDTO: BusinessDTO;
    startTime: string; // ISO Instant
    endTime: string;   // ISO Instant
    price: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED'; // Enum matching backend
    createdAt: string;
    updatedAt: string;
}

export interface UserDTO {
    id: string;
    name: string;
    email: string;
}

export interface ProfessionalDTO {
    id: string;
    name: string;
    // Add other fields as needed
}

export interface ServiceDTO {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
}

export interface BusinessDTO {
    id: string;
    name: string;
}
