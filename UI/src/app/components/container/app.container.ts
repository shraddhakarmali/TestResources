import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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
    selector: 'app-container',
    templateUrl: './app.container.html',
})
export class AppContainer {
hosts = [];
    user = "";
    myValue = true;
    headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private _http: Http) {
       /* this.hosts = [
            { "HostName": "Server 1", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 2", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha D", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "false" },
            { "HostName": "Server 3", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 4", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "True" },
            { "HostName": "Server 5", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "False" },
            { "HostName": "Server 6", "IP": "1.1.1.1", "Description": "Windows 2010", "User": "Shradha K", "Checkout": "12 PM", "Checkin": "1 PM", "IsActive": "False" },
        ];*/
    }

    onRequest(event$) {
        console.log(event$.HostName);
        this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify({ HostName: event$.HostName, IsActive: true }), { headers: this.headers })
            .toPromise()
            .then()
            .catch();

    }

    onRelease(event$) {
        console.log(event$.HostName);
        this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify({ HostName: event$.HostName, IsActive: false }), { headers: this.headers })
            .toPromise()
            .then()
            .catch();
    }

    ngOnInit() {
        //[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
        this._http
            .get(`http://localhost/ResourceManager/api/Users`)
            .map((r: Response) => { this.user = r.json(); console.log("User name in map " + r.json()); } )
            .subscribe(x => { });

        this._http
            .get(`http://localhost/ResourceManager/api/Hosts`)
            .map((r: Response) => r.json() as Host[]).subscribe(x => { this.hosts = x; console.log(x); },
            e => console.log('onError: %s', e),
            () => console.log('onCompleted'));

        
        //console.log(hostFromServer);
    }
}
