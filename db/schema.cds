namespace sales_order;

using { managed } from '@sap/cds/common';

type ApprovalStatusEnum : String(20) enum {
  Pending  = 'Pending';
  Approved = 'Approved';
  Rejected = 'Rejected';
}

entity SalesOrder : managed {
  key SalesOrderID      : String(10)              @Common.Label : 'Sales Order ID';
  CustomerName          : String(100)             @Common.Label : 'Customer Name';
  OrderDate             : Date                    @Common.Label : 'Order Date';
  Status                : String(20)              @Common.Label : 'Order Status';
  TotalAmount           : Decimal(15,2)           @Common.Label : 'Total Amount';
  ApprovalStatus        : ApprovalStatusEnum      @Common.Label : 'Approval Status';
  ApprovalComments      : String(255)             @Common.Label : 'Approval Comments';
  LastModified          : Timestamp               @Common.Label : 'Last Modified';
  Currency              : String(5)               @Common.Label : 'Currency';
}