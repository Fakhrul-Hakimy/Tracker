import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Appointment, DailyLog, GlossaryTerm, TrackerDatabase } from '../models/pcos.models';

@Injectable({ providedIn: 'root' })
export class PcosDataService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly dbAssetUrl = 'db.json';
  private readonly useLocalApi = this.shouldUseLocalApi();
  private inMemoryDb: TrackerDatabase | null = null;

  constructor(private readonly http: HttpClient) {}

  getLogs(): Observable<DailyLog[]> {
    if (this.useLocalApi) {
      return this.http.get<DailyLog[]>(`${this.apiUrl}/logs`);
    }

    return this.readBrowserDb().pipe(map((db) => db.logs));
  }

  addLog(payload: DailyLog): Observable<DailyLog> {
    if (this.useLocalApi) {
      return this.http.post<DailyLog>(`${this.apiUrl}/logs`, payload);
    }

    return this.readBrowserDb().pipe(
      switchMap((db) => {
        const updatedDb: TrackerDatabase = { ...db, logs: [payload, ...db.logs] };
        return this.persistInMemoryDb(updatedDb).pipe(map(() => payload));
      })
    );
  }

  getTerms(): Observable<GlossaryTerm[]> {
    if (this.useLocalApi) {
      return this.http.get<GlossaryTerm[]>(`${this.apiUrl}/terms`);
    }

    return this.readBrowserDb().pipe(map((db) => db.terms));
  }

  addTerm(payload: GlossaryTerm): Observable<GlossaryTerm> {
    if (this.useLocalApi) {
      return this.http.post<GlossaryTerm>(`${this.apiUrl}/terms`, payload);
    }

    return this.readBrowserDb().pipe(
      switchMap((db) => {
        const nextId = db.terms.length ? Math.max(...db.terms.map((term) => term.id)) + 1 : 1;
        const term = { ...payload, id: payload.id || nextId };
        const updatedDb: TrackerDatabase = { ...db, terms: [term, ...db.terms] };
        return this.persistInMemoryDb(updatedDb).pipe(map(() => term));
      })
    );
  }

  getAppointments(): Observable<Appointment[]> {
    if (this.useLocalApi) {
      return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
    }

    return this.readBrowserDb().pipe(map((db) => db.appointments));
  }

  addAppointment(payload: Appointment): Observable<Appointment> {
    if (this.useLocalApi) {
      return this.http.post<Appointment>(`${this.apiUrl}/appointments`, payload);
    }

    return this.readBrowserDb().pipe(
      switchMap((db) => {
        const nextId = db.appointments.length
          ? Math.max(...db.appointments.map((appointment) => appointment.id)) + 1
          : 1;

        const appointment = { ...payload, id: payload.id || nextId };
        const updatedDb: TrackerDatabase = {
          ...db,
          appointments: [appointment, ...db.appointments]
        };

        return this.persistInMemoryDb(updatedDb).pipe(map(() => appointment));
      })
    );
  }

  private shouldUseLocalApi(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
  }

  private readBrowserDb(): Observable<TrackerDatabase> {
    if (this.inMemoryDb) {
      return of(this.inMemoryDb);
    }

    return this.readDefaultDatabase().pipe(
      tap((db) => {
        this.inMemoryDb = db;
      })
    );
  }

  private readDefaultDatabase(): Observable<TrackerDatabase> {
    return this.http.get<TrackerDatabase>(this.dbAssetUrl).pipe(
      catchError(() =>
        of({
          logs: [],
          terms: [],
          appointments: []
        })
      )
    );
  }

  private persistInMemoryDb(database: TrackerDatabase): Observable<TrackerDatabase> {
    this.inMemoryDb = database;
    return of(database);
  }
}
