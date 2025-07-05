import { ApprovalStatusEnum, SalesOrder } from '#cds-models/sales_order';
import { ChangeOrderStatusDto } from '#cds-models/sales_order_types';
import { SalesOrder as SalesOrderA2X } from '#cds-models/SalesOrderA2X';
import cds from '@sap/cds';

export class salesorderService extends cds.ApplicationService {
  async init() {
    const salesOrderDestination = await cds.connect.to('SalesOrderA2X');
    const alert = await cds.connect.to('notifications');

    this.on("syncOrders", async (request: cds.Request) => {
      const orders: SalesOrderA2X[] = await salesOrderDestination.send({
        method: 'GET',
        path: `SalesOrder`,
        headers: {
          apikey: process.env.apikey
         }
      });

      for (const order of orders) {
        await UPSERT.into(SalesOrder).entries([{
          SalesOrderID: order.SalesOrder,
          SalesOrderDate: order.SalesOrderDate,
          SoldToParty: order.SoldToParty,
          TotalNetAmount: order.TotalNetAmount,
          TransactionCurrency: order.TransactionCurrency,
          RequestedDeliveryDate: order.RequestedDeliveryDate,
          OverallSDProcessStatus: order.OverallSDProcessStatus,
          ApprovalStatus: ApprovalStatusEnum.Pending,
        }]);
      }

      return request.info('Sync completed!');
    });

    this.on("approveOrder", async (request: cds.Request<ChangeOrderStatusDto>) => {
      const { salesOrderID, comments } = request.data;

      if (!salesOrderID) {
        request.reject(422, 'Sales Order ID must be specified!');
      }

      await UPDATE(SalesOrder, salesOrderID).set({
        ApprovalStatus: ApprovalStatusEnum.Approved,
        ApprovalComments: comments
      });

      await (alert as any).notify('OrderStatusChanged', {
        recipients: [cds.context?.user.id],
        data: {
          saledOrderId: salesOrderID,
          changeEvent: ApprovalStatusEnum.Approved,
          user: cds.context?.user.id,
        }
      });

      return request.info('The order was approved successfully!');
    });

    this.on("rejectOrder", async (request: cds.Request<ChangeOrderStatusDto>) => {
      const { salesOrderID, comments } = request.data;

      if (!salesOrderID) {
        request.reject(422, 'Sales Order ID must be specified!');
      }

      await UPDATE(SalesOrder, salesOrderID).set({
        ApprovalStatus: ApprovalStatusEnum.Rejected,
        ApprovalComments: comments
      });

      await (alert as any).notify('OrderStatusChanged', {
        recipients: [cds.context?.user.id],
        data: {
          saledOrderId: salesOrderID,
          changeEvent: ApprovalStatusEnum.Rejected,
          user: cds.context?.user.id,
        }
      });


      return request.info('The order was rejected!');
    });

    return super.init()
  }
}
