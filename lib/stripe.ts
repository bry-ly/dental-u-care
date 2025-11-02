import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_STRIPE_PUBLISHABLE_KEY!

export const STRIPE_PRICE_IDS = {
  dentalconsultation: "prod_TIeJfOVZGKlkdw",
  oralprophylaxis: "prod_TIeLOljUBOshB4",
  toothxray: "prod_TIeMUqUvMet1zy",
  toothwhitening: "prod_TIeSvnnIPSkALQ",
  surgicaltoothextraction: "prod_TIeSvnnIPSkAlQ",
  dentalfillings: "prod_TIeQpflV2MRn50",
  orthodontics: "prod_TIeUzzmtSnLAnI",
  deepcleaning: "prod_TIeNiKDg9TWZ0",

};

export type StripePricesId = keyof typeof STRIPE_PRICE_IDS;