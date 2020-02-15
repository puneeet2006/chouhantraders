import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from 'angularfire2/firestore'
import { IOrders } from '../models/Orders';
import { ITransactions } from '../models/transactions';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class OrdersService {

	constructor(public aFireStore: AngularFirestore) {
	}

	getOrders(): Observable<IOrders[]> {
		return this.aFireStore.collection('orders').valueChanges({ idField: 'order_id' });
	}

	getTransactions(): Observable<ITransactions[]> {
		return this.aFireStore.collection('transaction').valueChanges();
	}

}