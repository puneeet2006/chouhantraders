export interface IOrders {
	order_id?:string,
	customer_id?:string,
	date?:string,
	grandTotal?:number,
	product_details?:Array<any>,
	customerName?:string,
	transactionDetails?:[{}]

}
