import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection, AngularFirestoreModule} from 'angularfire2/firestore'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  	constructor(public aFireStore:AngularFirestore ) {
  	}

  	getCustomers():Observable<any[]>{
  		return this.aFireStore.collection('customer').valueChanges();
  	}

  	getCustomerByMobile(mobileNo):Observable<any[]>{
  		return this.aFireStore.collection('customer', ref => ref.where('mobile','==','9907053804')).valueChanges();
  	}
}
