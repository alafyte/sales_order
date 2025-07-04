import { ApprovalStatusEnum, SalesOrder } from '#cds-models/sales_order';
import { ApproveOrderDto } from '#cds-models/sales_order_types';
import { SalesOrder as SalesOrderA2X } from '#cds-models/SalesOrderA2X';
import cds from '@sap/cds';

export class salesorderService extends cds.ApplicationService {
  init() {

    this.on("syncOrders", async (request: cds.Request) => {
      const destination = await cds.connect.to('SalesOrderA2X');

      const orders: SalesOrderA2X[] = await destination.send({
        method: 'GET',
        path: `SalesOrder`,
        //headers: {
        //  apikey: process.env.apikey
       // }
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

    this.on("approveOrder", async (request: cds.Request<ApproveOrderDto>) => {
      console.log("Not implemented!");
    });
    return super.init()
  }
}
