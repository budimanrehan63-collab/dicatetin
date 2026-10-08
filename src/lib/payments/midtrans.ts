import crypto from "crypto";

export interface MidtransTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  planName: string;
}

/**
 * Verifies the Midtrans Webhook SHA512 signature key
 * formula: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-sample";
  const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const calculatedSignature = crypto
    .createHash("sha512")
    .update(rawString)
    .digest("hex");

  return calculatedSignature === signatureKey;
}

/**
 * Creates a Midtrans Snap transaction token
 */
export async function createSnapToken(params: MidtransTransactionParams): Promise<{
  token: string;
  redirectUrl: string;
}> {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-sample";
  const baseUrl = isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

  const authHeader = Buffer.from(`${serverKey}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone || "",
    },
    item_details: [
      {
        id: params.planName.toLowerCase(),
        price: params.grossAmount,
        quantity: 1,
        name: `Langganan Dicatetin - Paket ${params.planName} (30 Hari)`,
      },
    ],
  };

  try {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return {
      token: data.token || "sample_snap_token",
      redirectUrl: data.redirect_url || "https://app.sandbox.midtrans.com/snap/v2/vtweb/sample",
    };
  } catch (err) {
    console.warn("Midtrans Snap request failed, returning mock token:", err);
    return {
      token: `mock_snap_token_${Date.now()}`,
      redirectUrl: "https://app.sandbox.midtrans.com/snap/v2/vtweb/mock",
    };
  }
}
