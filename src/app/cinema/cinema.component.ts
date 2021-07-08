import {Component, OnInit} from '@angular/core';
import {CinemaServiceService} from '../srvices/cinema-service.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes;
  public cinemas;
  public salles;
  public currentVille;
  public currentCinema;
  public currentSalle;
  public currentProjection;
  public currentSeance;
  public selectedTickets: any[];

  constructor(public cinemaService: CinemaServiceService) {
  }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;

      }, err => {
        console.log(err);

      });
  }

  onGetCinemas(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;

      }, err => {
        console.log(err);

      });
  }

  onGetSalles(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);
            });
        });

      }, err => {
        console.log(err);

      });
  }

  onGetplaces(p) {
    this.currentSeance = p.seance;
    this.currentProjection = p;
    this.cinemaService.getPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];

      }, err => {
        console.log(err);

      });
  }

  onSelectTickets(t) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t) {
    let styleClass = 'btn ';
    if (t.reserve == true) {
      styleClass += 'btn-danger ticket';
    } else if (t.selected == true) {
      styleClass += 'btn-warning ticket';
    } else {
      styleClass += 'btn-success ticket';
    }
    return styleClass;
  }

  onPayTickets(form) {
    let listIdTicket = [];
    this.selectedTickets.forEach(t => {
      listIdTicket.push(t.id);
    });
    form.listIdTicket = listIdTicket;
    this.cinemaService.payerTickets(form)
      .subscribe(data => {
        alert("tickets reservés avec succes");
        this.onGetplaces(this.currentProjection);
        console.log(form);

      }, err => {
        console.log(err);

      });
  }
}
