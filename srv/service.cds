using {sales_order as my} from '../db/schema.cds';

@path: '/service/salesorderService'
service salesorderService {
    @readonly
    @requires: 'Viewer'
    entity SalesOrders as projection on my.SalesOrder;

    @requires: 'Admin'
    action syncOrders()                                           returns String;

    @requires: 'Approver'
    action approveOrder(salesOrderID : String, comments : String) returns String;

    @requires: 'Approver'
    action rejectOrder(salesOrderID : String, comments : String)  returns String;
}

annotate salesorderService with @requires: ['authenticated-user'];
