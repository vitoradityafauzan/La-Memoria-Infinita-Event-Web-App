export interface IUserReg {
  firstName: String;
  lastName: String;
  email: String;
  phone: String;
  password: String;
  userType: String;
  referralCode?: String;
  points?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface DecodedToken {
  id: string;
  userType: string;
  organizerId: string;
  userId: string;
}

export interface Referral {
  id: number;
  referrerId: number;
  referredId: number;
  pointsAwarded: number;
  expiresAt: Date;
  usedAt: Date;
  expired: boolean;
}

export interface IUserState {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  points: number;
}

// export interface Event {
//   id: number;
//   image: string;
//   name: string;
//   location: string;
//   eventDate: string;
//   eventTime: string;
//   sellEndDate: string;
//   sellEndTime: string;
//   isPaidEvent: boolean;
//   price: number;
//   availableSeats: number;
//   ticket: Ticket;
// }

export interface DashboardData {
  fullName: string;
  totalRevenue: number;
  totalOrders: number;
  totalTicketsSold: number;
  events: Event[];
  previousWeekRevenue: number; // Added field for comparison
  previousWeekTicketsSold: number; // Added field for comparison
  previousWeekOrders: number;
}

export interface Ticket {
  id: number;
  event: Event;
  purchaseDate: string;
  price: number;
  status: string;
  events: Event[];
}

export interface TicketDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  tickets: Ticket[];
  ticket: Ticket;
  event: Event;
}

export interface IUserSimple {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  id: number;
}