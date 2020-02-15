import { Component, OnInit } from '@angular/core';
import { IOrders } from '../../models/orders';
import { ITransactions } from '../../models/transactions';
import { ICustomer } from '../../models/customer';
import { Observable, combineLatest } from 'rxjs';
import { CustomersService } from '../../services/customers.service';
import { OrdersService } from '../../services/orders.service';
import { map, take } from 'rxjs/operators';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

	orders$: Observable<IOrders[]>;
	customers$: Observable<ICustomer[]>;
	transactions$: Observable<ITransactions[]>;
	orderMain$: Observable<any>;
	orderData: Observable<any>;
 
  constructor(private orderService: OrdersService,
	  private customerService: CustomersService
  	) { }


	ngOnInit() {

		this.orders$ = this.orderService.getOrders();
		this.transactions$ = this.orderService.getTransactions();
		this.customers$ = this.customerService.getCustomers();


		this.orderMain$ = combineLatest([this.orders$, this.customers$,this.transactions$
		]).pipe(
			map(([orders, customers,transactions]) =>
				orders.map(order => ({
					...order,
					customerName: customers.find(c => order.customer_id === c.id).name,
					transactionDetails: transactions.filter(t => { if(order.order_id === t.order_id) return t })
				}))
			))


		this.orderMain$.subscribe(item=>{
			this.orderData = this.processOrderData(item);
			
		})
  }

  processOrderData(orders)
  {
	 let orderObj = orders.map(item=>{
		 let obj = {};
		 obj['customer_name'] = item.customerName;
		 obj['order_total'] = item.grandTotal;
		 obj['order_date'] = item.date.toDate();
		 obj['order_payment_status'] = this.getPaymentStatus(item.grandTotal,item.transactionDetails)
		 obj['product_details'] = item.product_details;
		 obj['trans_details'] = item.transactionDetails;
		 return obj;
	 })
	
	  return orderObj;

  }

  getPaymentStatus(grandTotal,transDetails){
  	if(transDetails.length > 1)
  	{
			
		let amountPaid = transDetails.reduce((a, b) => a['amount_paid'] + b['amount_paid']);
		if (grandTotal == amountPaid)
		{
			return 'Fully Paid';
		}
		else
		{
			return 'Pending';
		}
  	}
  	else
  	{
		let transValue = transDetails.map(item=>item['amount_paid']);
			
		if (grandTotal == transValue[0]) {
			return 'Fully Paid';
		}
		else {
			return 'Pending';
		}
  	}
	  
  }

}
