import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
export class Request {
    UserName: string;
    CheckoutTime: string;
    ReturnTime: string;
    IsActive: boolean;
    RequestedOn: string;
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
export class AppContainer implements OnInit {
hosts = [];
    user = "";
    myValue = true;
    headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private _http: Http) {
      
    }

    onRequest(event$) {
        console.log(event$.HostName);
        /*this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify({ HostName: event$.HostName, IsActive: true }), { headers: this.headers })
            .toPromise()
            .then()
            .catch();*/

    }

    onRelease(event$) {
        console.log(event$.HostName);
        /*this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify({ HostName: event$.HostName, IsActive: false }), { headers: this.headers })
            .toPromise()
            .then()
            .catch();*/
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
