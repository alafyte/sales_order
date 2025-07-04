using {sales_order as my} from '../db/schema.cds';

@path: '/service/salesorderService'
service salesorderService {
    entity SalesOrders as projection on my.SalesOrder;
    action syncOrders()                                           returns String;
    action approveOrder(salesOrderID : String, comments : String) returns String;
    action rejectOrder(salesOrderID : String, comments : String)  returns String;
}

// annotate salesorderService with @requires: ['authenticated-user'];
