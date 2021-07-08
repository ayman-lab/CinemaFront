import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CinemaServiceService {

  public url: String = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getVilles() {

    return this.http.get<any[]>(this.url + '/villes', {observe: 'body'});
  }

  getCinemas(v) {
    return this.http.get(this.url + '/villes/' + v.id + '/cinemas');
  }

  getSalles(c) {
    return this.http.get<any[]>(this.url + '/cinemas/' + c.id + '/salles', {observe: 'body'});
  }

  getProjections(salle) {
    let path = salle._links.projections.href.replace('{?projection}', '');
    return this.http.get(path + '?projection=p1');
  }

  getPlaces(p) {

    let path = p._links.tickets.href.replace('{?projection}', '');
    return this.http.get(path + '?projection=p2');
  }

  payerTickets(form) {
    return this.http.post(this.url + '/payerTicket', form);

  }
}
