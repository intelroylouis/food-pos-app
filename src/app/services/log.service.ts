import { Injectable } from '@angular/core';
import { PrintService } from './print.service';
import { CartService } from './cart.service';
import { CouponService } from './coupon.service';
import { PaymentService } from './payment.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

// 決済処理成功後のデータ保持サービス。
@Injectable({
  providedIn: 'root'
})

export class LogService {
  resOutput: any;

  constructor(
      public printService: PrintService,
      public cartService: CartService,
      public couponService: CouponService,
      public paymentService: PaymentService,
      private http: HttpClient
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'x-api-key': environment.apiToken,
    })
  };

  outputJson(){
    this.resOutput = this.paymentService.outputJson;
  }

  logJson = () => {
    return new Promise(async resolve => {
      this.outputJson();
      let paymentMethod: number;
      switch (this.paymentService.getPaymentMethod()){
        case 'cash':
          paymentMethod = 1;
          break;
        case 'credit':
          paymentMethod = 2;
          break;
        case 'ic':
          paymentMethod = 3;
          break;
        case 'qr':
          paymentMethod = 4;
          break;
      }
      // Object.values(this.resOutput).map(value =>{
      //   console.log(value);
      // })
      const cart = this.cartService.getCart();
      const cartCoupon = this.couponService.getCartCoupon();

      const orderDetail = [];
      const couponDetail = [];
      const buyType = this.cartService.getBuyType();
      let detailNum = 1;

      console.log('cart' + cart);
      cart.map(value => {
        console.log(value);
      });

      cart.map(item => {
        orderDetail.push({
          detail_no: detailNum,
          product_id: item.id,
          ctax_rate: buyType === 'takeout' ? item.taxRate02 : item.taxRate01,
          unit_price: buyType === 'takeout' ? item.price02 : item.price01,
          final_unit_price: buyType === 'takeout' ? item.price02 : item.price01,
          detail_quantity: item.amount,
          subtotal: item.subtotal,
          detail_ctax_price: buyType === 'takeout' ? Math.floor(item.subtotal * (item.taxRate02 * 0.01)) : Math.floor(item.subtotal * (item.taxRate01 * 0.01)),
          discount_price: item.discount_price
          });
        detailNum += 1;
      });

      cartCoupon.map(coupon => {
        couponDetail.push({
          coupon_id: coupon.id,
          discount_price: coupon.discount_price,
          quantity: coupon.amount
        });
      });

      // console.log(typeof(Number(JSON.stringify(this.resOutput.AdditionalSecurityInformation.TerminalID))));

      let logJson: any;
      // console.log('this.resOutput.SequenceNumber' + this.resOutput.SequenceNumber);
      // console.log('this.resOutput.CurrentService' + this.resOutput.CurrentService);
      // console.log('this.resOutput.ApprovalCode' + this.resOutput.ApprovalCode);
      // console.log('this.resOutput.CardCompanyID' + this.resOutput.CardCompanyID);
      // console.log('this.resOutput.PaymentCondition' + this.resOutput.PaymentCondition);
      // console.log('this.resOutput.SlipNumber' + this.resOutput.SlipNumber);
      // console.log('this.resOutput.TransactionNumber' + this.resOutput.TransactionNumber);

      if (paymentMethod === 1){
        logJson = {
          is_training: this.paymentService.trainingMode,
          terminal_id: Number(this.printService.printerNumString),
          slip_no: this.printService.receiptNumber,
          ordered_at: this.printService.nowDate + ' ' + this.printService.nowTime,
          sales_style_id: buyType === 'takeout' ? 2 : 1,
          payment_method_id: paymentMethod,
          payment_amount: this.printService.getTotalWithTax(),
          cash_deposit_amount: '',
          cash_payout_amount: '',
          qr_sequence_id: '',
          qr_service_name: '',
          qr_slip_number: '',
          qr_transaction_number: '',
          credit_sequence_id: '',
          credit_service_name: '',
          credit_approval_number: '',
          credit_company_id: '',
          credit_condition_id: '',
          credit_slip_number: '',
          credit_transaction_number: '',
          ic_sequence_id: '',
          ic_service_name: '',
          ic_balance: '',
          ic_condition_id: '',
          ic_sprw_id: '',
          ic_transaction_number: '',
          ic_approval_number: '',
          ic_slip_number: '',
          ic_before_balance: '',
          isSent: false,
          order_detail: orderDetail,
          coupon_detail: couponDetail
        };
      }


      if (paymentMethod === 2){
        logJson = {
          is_training: this.paymentService.trainingMode,
          terminal_id: Number(this.printService.printerNumString),
          slip_no: this.printService.receiptNumber,
          ordered_at: this.printService.nowDate + ' ' + this.printService.nowTime,
          sales_style_id: buyType === 'takeout' ? 2 : 1,
          payment_method_id: paymentMethod,
          payment_amount: this.printService.getTotalWithTax(),
          cash_deposit_amount: '',
          cash_payout_amount: '',
          qr_sequence_id: '',
          qr_service_name: '',
          qr_slip_number: '',
          qr_transaction_number: '',
          credit_sequence_id: this.resOutput.SequenceNumber,
          credit_service_name: this.resOutput.CurrentService,
          credit_approval_number: this.resOutput.ApprovalCode,
          credit_company_id: this.resOutput.CardCompanyID,
          credit_condition_id: this.resOutput.PaymentCondition,
          credit_slip_number: this.resOutput.SlipNumber,
          credit_transaction_number: this.resOutput.TransactionNumber,
          ic_sequence_id: '',
          ic_service_name: '',
          ic_balance: '',
          ic_condition_id: '',
          ic_sprw_id: '',
          ic_transaction_number: '',
          ic_approval_number: '',
          ic_slip_number: '',
          ic_before_balance: '',
          isSent: false,
          order_detail: orderDetail,
          coupon_detail: couponDetail
        };
      }

      if (paymentMethod === 3){
        logJson = {
          is_training: this.paymentService.trainingMode,
          terminal_id: Number(this.printService.printerNumString),
          slip_no: this.printService.receiptNumber,
          ordered_at: this.printService.nowDate + ' ' + this.printService.nowTime,
          sales_style_id: buyType === 'takeout' ? 2 : 1,
          payment_method_id: paymentMethod,
          payment_amount: this.printService.getTotalWithTax(),
          cash_deposit_amount: '',
          cash_payout_amount: '',
          qr_sequence_id: '',
          qr_service_name: '',
          qr_slip_number: '',
          qr_transaction_number: '',
          credit_sequence_id: '',
          credit_service_name: '',
          credit_approval_number: '',
          credit_company_id: '',
          credit_condition_id: '',
          credit_slip_number: '',
          credit_transaction_number: '',
          ic_sequence_id: this.resOutput.SequenceNumber,
          ic_service_name: this.resOutput.CurrentService,
          ic_balance: this.resOutput.Balance,
          ic_condition_id: this.resOutput.PaymentCondition,
          ic_sprw_id: this.resOutput.AdditionalSecurityInformation.sprwid,
          ic_transaction_number: this.resOutput.AdditionalSecurityInformation.statementID,
          ic_approval_number: this.resOutput.AdditionalSecurityInformation.ICsequence,
          ic_slip_number: this.resOutput.AdditionalSecurityInformation.termDealNumber,
          ic_before_balance: this.resOutput.AdditionalSecurityInformation.beforeBalance,
          isSent: false,
          order_detail: orderDetail,
          coupon_detail: couponDetail
        };
      }

      if (paymentMethod === 4){
        logJson = {
          is_training: this.paymentService.trainingMode,
          terminal_id: Number(this.printService.printerNumString),
          slip_no: this.printService.receiptNumber,
          ordered_at: this.printService.nowDate + ' ' + this.printService.nowTime,
          sales_style_id: buyType === 'takeout' ? 2 : 1,
          payment_method_id: paymentMethod,
          payment_amount: this.printService.getTotalWithTax(),
          cash_deposit_amount: '',
          cash_payout_amount: '',
          qr_sequence_id: this.resOutput.SequenceNumber,
          qr_service_name: this.resOutput.CurrentService,
          qr_slip_number: this.resOutput.SlipNumber,
          qr_transaction_number: this.resOutput.TransactionNumber,
          credit_sequence_id: '',
          credit_service_name: '',
          credit_approval_number: '',
          credit_company_id: '',
          credit_condition_id: '',
          credit_slip_number: '',
          credit_transaction_number: '',
          ic_sequence_id: '',
          ic_service_name: '',
          ic_balance: '',
          ic_condition_id: '',
          ic_sprw_id: '',
          ic_transaction_number: '',
          ic_approval_number: '',
          ic_slip_number: '',
          ic_before_balance: '',
          isSent: false,
          order_detail: orderDetail,
          coupon_detail: couponDetail
        };
      }

      console.log('logJson' + logJson);
      console.log('logJson' + JSON.stringify(logJson));

      // storageから未送信データを取得
      const logStorage: Array<any> = await this.printService.onGetClick('logStorage') as any[];
      // 今回の注文を追加
      logStorage.push(logJson);
      const unSendOrders: any[] = new Array(0);
      for (const order of logStorage) {
        console.log('postOrder.');
        await this.postOrder(order).subscribe(async res => {
          console.log('HTTP response');
          console.log(res);
          await this.printService.onSetClick('logStorage', unSendOrders);
        }, async err => {
          console.log('HTTP Error');
          console.log(err);
          // 送信失敗したデータを蓄積
          unSendOrders.push(order);
          // 送信失敗したデータをstorageに保存
          await this.printService.onSetClick('logStorage', unSendOrders);
        }, () => console.log('HTTP request completed.')
        );
      }
      resolve(logJson);
    });
  }

  postOrder(order): Observable<any>{
    return this.http.post(environment.apiUrl + '/order', JSON.stringify(order), this.httpOptions)
        .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
        'Something bad happened; please try again later.');
  }
}
