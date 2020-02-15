import { Injectable } from '@angular/core';
import {AngularFirestore,AngularFirestoreCollection, AngularFirestoreModule} from 'angularfire2/firestore'
import  {IProducts} from '../models/Products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  	constructor(public aFireStore:AngularFirestore ) {
  	}

  	getProducts():Observable<IProducts[]>{
  		 return this.aFireStore.collection('products').valueChanges();
  	} 
}
