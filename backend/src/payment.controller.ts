import { Controller, Post, Body } from '@nestjs/common';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('sk_test_your_secret_key', {
      apiVersion: '2020-08-27',
    });
  }

  @Post('create')
  async createPaymentIntent(@Body() body: { amount: number }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: body.amount,
        currency: 'eur',
        payment_method_types: ['card'],
      });
      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Payment creation failed');
    }
  }
}
