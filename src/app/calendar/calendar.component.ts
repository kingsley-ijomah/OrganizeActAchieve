import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, CalendarEvent, ProjectTask, Project } from '../services/data.service';

export type CalendarView = 'day' | 'week' | 'month';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  currentView: CalendarView = 'month';
  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  
  events: CalendarEvent[] = [];
  ticklerItems: CalendarEvent[] = [];
  showEventModal = false;
  editingEvent: CalendarEvent | null = null;
  
  // Event form
  eventForm: {
    title: string;
    description: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    isAllDay: boolean;
    location: string;
    reminderDate: string;
  } = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    location: '',
    reminderDate: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadEvents();
    this.loadTicklerItems();
    this.selectedDate = new Date();
  }

  loadEvents() {
    const startDate = this.getViewStartDate();
    const endDate = this.getViewEndDate();
    this.events = this.dataService.getCalendarEvents(startDate, endDate);
  }

  loadTicklerItems() {
    this.ticklerItems = this.dataService.getTicklerItems();
  }

  getViewStartDate(): string {
    const date = new Date(this.currentDate);
    if (this.currentView === 'month') {
      date.setDate(1);
      // Get first day of week (Sunday = 0)
      const firstDay = date.getDay();
      date.setDate(date.getDate() - firstDay);
    } else if (this.currentView === 'week') {
      const day = date.getDay();
      const diff = date.getDate() - day;
      date.setDate(diff);
    }
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  getViewEndDate(): string {
    const date = new Date(this.currentDate);
    if (this.currentView === 'month') {
      date.setMonth(date.getMonth() + 1);
      date.setDate(0); // Last day of current month
      const lastDay = date.getDay();
      date.setDate(date.getDate() + (6 - lastDay)); // Fill to end of week
    } else if (this.currentView === 'week') {
      date.setDate(date.getDate() + 6);
    } else {
      date.setDate(date.getDate() + 1);
    }
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  }

  // View navigation
  setView(view: CalendarView) {
    this.currentView = view;
    this.loadEvents();
  }

  previousPeriod() {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.loadEvents();
  }

  nextPeriod() {
    if (this.currentView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.currentView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.loadEvents();
  }

  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.loadEvents();
  }

  // Date helpers
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isSelected(date: Date): boolean {
    return date.getDate() === this.selectedDate.getDate() &&
           date.getMonth() === this.selectedDate.getMonth() &&
           date.getFullYear() === this.selectedDate.getFullYear();
  }

  // Month view
  getMonthDays(): Date[] {
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const days: Date[] = [];
    const current = new Date(startDate);
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }

  getEventsForDay(date: Date): CalendarEvent[] {
    const dateStr = date.toISOString().split('T')[0];
    return this.events.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventDateStr = eventDate.toISOString().split('T')[0];
      
      if (event.endDate) {
        const endDate = new Date(event.endDate);
        const endDateStr = endDate.toISOString().split('T')[0];
        return dateStr >= eventDateStr && dateStr <= endDateStr;
      }
      return eventDateStr === dateStr;
    });
  }

  // Week view
  getWeekDays(): Date[] {
    const date = new Date(this.currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date.setDate(diff));
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // Day view
  getDayHours(): string[] {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });
  }

  getEventsForHour(day: Date, hour: string): CalendarEvent[] {
    const [hours] = hour.split(':');
    const hourNum = parseInt(hours, 10);
    const date = new Date(day);
    date.setHours(hourNum, 0, 0, 0);
    
    return this.events.filter(event => {
      if (event.isAllDay) return false;
      const eventDate = new Date(event.startDate);
      if (event.startTime) {
        const [eventHour] = event.startTime.split(':');
        return eventDate.getDate() === date.getDate() &&
               eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear() &&
               parseInt(eventHour, 10) === hourNum;
      }
      return false;
    });
  }

  // Event management
  openEventModal(event?: CalendarEvent, date?: Date) {
    if (event) {
      this.editingEvent = event;
      this.eventForm = {
        title: event.title,
        description: event.description || '',
        startDate: event.startDate.split('T')[0],
        startTime: event.startTime || '',
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
        endTime: event.endTime || '',
        isAllDay: event.isAllDay || false,
        location: event.location || '',
        reminderDate: event.reminderDate ? event.reminderDate.split('T')[0] : ''
      };
    } else {
      this.editingEvent = null;
      const defaultDate = date || this.selectedDate;
      this.eventForm = {
        title: '',
        description: '',
        startDate: defaultDate.toISOString().split('T')[0],
        startTime: '',
        endDate: '',
        endTime: '',
        isAllDay: false,
        location: '',
        reminderDate: ''
      };
    }
    this.showEventModal = true;
  }

  closeEventModal() {
    this.showEventModal = false;
    this.editingEvent = null;
  }

  saveEvent() {
    if (!this.eventForm.title.trim()) return;
    
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: this.eventForm.title.trim(),
      description: this.eventForm.description.trim() || undefined,
      startDate: this.eventForm.startDate,
      startTime: this.eventForm.isAllDay ? undefined : (this.eventForm.startTime || undefined),
      endDate: this.eventForm.endDate || undefined,
      endTime: this.eventForm.isAllDay ? undefined : (this.eventForm.endTime || undefined),
      isAllDay: this.eventForm.isAllDay,
      location: this.eventForm.location.trim() || undefined,
      reminderDate: this.eventForm.reminderDate || undefined,
      createdAt: this.editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (this.editingEvent) {
      this.dataService.updateCalendarEvent(this.editingEvent.id, eventData);
    } else {
      this.dataService.addCalendarEvent(eventData);
    }
    
    this.loadEvents();
    this.loadTicklerItems();
    this.closeEventModal();
  }

  isTaskEvent(event: CalendarEvent): boolean {
    return event.id < 0;
  }

  canDeleteEvent(event: CalendarEvent): boolean {
    return event.id > 0; // Only allow deletion of regular events, not tasks
  }

  deleteEvent(event: CalendarEvent) {
    if (confirm(`Delete "${event.title}"?`)) {
      if (event.id > 0) {
        this.dataService.deleteCalendarEvent(event.id);
        this.loadEvents();
        this.loadTicklerItems();
      }
    }
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    if (this.currentView === 'day') {
      this.currentDate = new Date(date);
      this.loadEvents();
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  getAllDayEventsForDay(date: Date): CalendarEvent[] {
    return this.getEventsForDay(date).filter(e => e.isAllDay);
  }

  getTimedEventsForDay(date: Date): CalendarEvent[] {
    return this.getEventsForDay(date).filter(e => !e.isAllDay);
  }

  formatDateString(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString();
  }

  getMonthName(): string {
    if (this.currentView === 'month') {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (this.currentView === 'week') {
      const weekStart = this.getWeekDays()[0];
      const weekEnd = this.getWeekDays()[6];
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return this.selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  getEventPosition(event: CalendarEvent): number {
    if (!event.startTime) return 0;
    const [hours, minutes] = event.startTime.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    return (hour * 100 / 24) + (minute * 100 / (24 * 60));
  }
}
