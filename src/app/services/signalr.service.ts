import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalrService {

  private connection!: signalR.HubConnection;

  start(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7250/hubs/applications', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.connection.start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR error', err));
  }

  onApplicationUpdated(callback: (update: any) => void): void {
    this.connection.on('ApplicationUpdated', callback);
  }
}