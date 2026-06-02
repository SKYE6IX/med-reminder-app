// Define your exported module types here.
export interface TokenizeOptions {
  amount: number;
  currency: string;

  title: string;
  subtitle: string;

  shopId: string;
  clientApplicationKey: string;
}

export interface TokenizeResult {
  paymentToken: string;
  paymentMethod: string;
}
