import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection, AngularFirestoreModule} from 'angularfire2/firestore'
import  {IStock} from '../models/stock';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  	constructor(public aFireStore:AngularFirestore ) {
  	}

  	getStock():Observable<IStock[]>{
  		return this.aFireStore.collection('stock').valueChanges();
  	} 
}
