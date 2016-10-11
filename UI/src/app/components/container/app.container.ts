import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

//[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
export class Request {
    RequestId: number;
    UserName: string;
    CheckoutTime: string;
    ReturnTime: string;
    IsActive: boolean;
    RequestedOn: string;
    IsInProgress: boolean
};

export class Host {
    Requests: Request[];
    HostName: string;
    IP: string;
    Description: string;
    IsMyRequestPending: Boolean
    
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

    model = new Host();
    active = true;

    constructor(private _http: Http) {
    }

    onRequest(event$) {
        console.log(event$.HostName);
        this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify({ RequestId: 0, HostName: event$.HostName, IsActive: true }), { headers: this.headers })
            .toPromise()
            .then(()=> { this.getHosts(); })
            .catch((e) => {console.log(e)});

    }

    onRelease(event$) {
        console.log(event$.HostName);
        var request;
        
        event$.Requests.forEach(element => {
            if(element.UserName == this.user){
                request = element;
            }
        });
        console.log(request.RequestId);
        this._http
            .post(`http://localhost/ResourceManager/api/Requests`, JSON.stringify(
                { 
                    RequestId: request.RequestId,
                    HostName: event$.HostName, 
                    IsActive: false ,
                    CheckoutTime: request.CheckoutTime

                }), { headers: this.headers })
            .toPromise()
            .then(()=> { this.getHosts(); })
            .catch((e) => {console.log(e)});
    }

    onSubmit() {
        this._http.post(`http://localhost/ResourceManager/api/Hosts`, JSON.stringify({ HostName: this.model.HostName, IP: this.model.IP,
                            Description: this.model.Description }) , { headers: this.headers }).toPromise().then(()=> {
                                 this.model = new Host();
                                 setTimeout(() => this.active = true, 0);
                                 this.getHosts();
                            }).catch((e) => {console.log(e)});
       
    }

    ngOnInit() {
        //[{"Requests":[],"HostName":"TestHost","IP":"1.1.1.1","Description":"Test VM"}]
        this._http
            .get(`http://localhost/ResourceManager/api/Users`)
            .map((r: Response) => { this.user = r.json(); console.log("User name in map " + r.json()); } )
            .subscribe(x => { });

            
       this.getHosts();
        //console.log(hostFromServer);
    }

    getHosts(){
        this._http
            .get(`http://localhost/ResourceManager/api/Hosts`)
            .map((r: Response) => r.json() as Host[]).subscribe(x => { this.hosts = x; console.log(x); },
            e => console.log('onError: %s', e),
            () => console.log('onCompleted'));

    }
}
