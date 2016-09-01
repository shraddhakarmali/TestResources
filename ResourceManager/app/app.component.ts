import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

//[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
export class Request {
};

export class Host {
    Requests: Request[];
    HostName: string;
    IP: string;
    Description: string;
};

@Component({
    selector: 'my-app',
    template: `
<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <p class="navbar-text navbar-brand">Automation Test Servers</p>
    </div>
  </div>
</nav>

<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">Current Checkouts</div>

  <!-- Table -->
  <table class="table">
    <tr>
<th></th>
<th></th>
    <th>Host Name</th>
    <th>IP</th> 
    <th>Description</th>
<th>User</th>
<th>Checkout Time</th>
<th>Checkin Time</th>
<th>Is Active</th>
<th></th>
  </tr>
    <tr  *ngFor="let host of hosts">
<td><div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" (click)="onRequest(host)"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span></button></div></td>
<td><div class="btn-group" role="group" aria-label="..."><button type="button" class="btn btn-default" (click)="onRelease(host)"><span class="glyphicon glyphicon-minus-sign" aria-hidden="true"></span></button></div></td>
    <td>{{host.HostName}}</td>
    <td>{{host.IP}}</td> 
    <td>{{host.Description}}</td>
<td>{{host.User}}</td>
<td>{{host.Checkout}}</td>
<td>{{host.Checkin}}</td>
<td>{{host.IsActive}}</td>
<td><span *ngIf="host.IsActive == 'True'" class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>
</tr>
  </table>
</div>
    `
})
export class AppComponent implements OnInit {
    hosts = [];
    myValue = true;

    constructor(private _http: Http) {
        this.hosts = [
            { "HostName": "Server 1", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 2", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha D", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "false" },
            { "HostName": "Server 3", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 4", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 5", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "False" },
            { "HostName": "Server 6", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "False" },
        ];
    }

    onRequest(event$) {
        console.log(event$.HostName);
    }

    onRelease(event$) {
        console.log(event$.HostName);
    }

    ngOnInit() {
        //[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
        this._http
            .get(`http://localhost/ResourceManager/api/Hosts`)
            .map((r: Response) => r.json() as Host[]).subscribe(x => { this.hosts = x; console.log(x);  },
            e => console.log('onError: %s', e),
            () => console.log('onCompleted'));
        //console.log(hostFromServer);
    }
}