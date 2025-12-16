import { Component, OnInit, ChangeDetectorRef, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationsService } from '../../services/applications.service';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applications.html',
  styleUrls: ['./applications.css']
})
export class ApplicationsComponent implements OnInit, OnDestroy {

  applications: any[] = [];

  showModal = false;

  newApplication = {
    type: 'request',
    message: ''
  };

  private hubConnection!: signalR.HubConnection;

  constructor(private applicationsService: ApplicationsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadApplications();
    this.startSignalR();
  }

  ngOnDestroy(): void {
    if (this.hubConnection){
      this.hubConnection.stop();
    }
  }

  loadApplications(): void {
    this.applicationsService.getMyApplications().subscribe({
      next: data => {
        console.log('Loaded from API:', data);
        this.applications = data;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error loading applications', err);
      }
    });
  }

  logout(): void{
    if(this.hubConnection){
      this.hubConnection.stop();
    }
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newApplication = { type: 'request', message: '' };
  }

  submit(): void {
    if (!this.newApplication.message.trim()) {
      return;
    }
    this.applicationsService.createApplication(this.newApplication).subscribe({
      next: created => {
        this.loadApplications();
        this.closeModal();
      },
      error: err => {
        console.error('Error creating application', err);
      }
    });
  }

  private startSignalR(): void {
    const token = localStorage.getItem('token');
    if(!token) {
      console.warn('No JWT token found, SignalR will not start');
      return;
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7250/hubs/applications', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();
    
    this.hubConnection
      .start()
      .then(() => console.log('SignalR connected'))
      .catch(err => console.error('SignalR connection error', err));
    
    this.hubConnection.on('ApplicationStatusUpdated', update => {
      console.log('SignalR update received:', update);
    
      const app = this.applications.find(
        a => a.id == update.applicationId
      );

      if (app) {
        app.status = update.status;
        this.cdr.detectChanges();
      }
    });
  }  
}
