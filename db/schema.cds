namespace sales_order;

using { managed } from '@sap/cds/common';

type ApprovalStatusEnum : String(20) enum {
  Pending  = 'Pending';
  Approved = 'Approved';
  Rejected = 'Rejected';
}

entity SalesOrder : managed {
  key SalesOrderID         : String(10);
  SalesOrderDate         : Date;
  SoldToParty            : String(10);
  TotalNetAmount         : Decimal(15,2);
  TransactionCurrency    : String(3);
  RequestedDeliveryDate  : Date;
  OverallSDProcessStatus : String(1);
  ApprovalStatus        : ApprovalStatusEnum      @Common.Label : 'Approval Status';
  ApprovalComments      : String(255)             @Common.Label : 'Approval Comments';
}