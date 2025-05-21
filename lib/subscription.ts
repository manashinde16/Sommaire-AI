import { razorpay } from "./razorpay";
import { getDbConnection } from "./db";

export async function getSubscriptionDetails(userId: any) {
  const sql = await getDbConnection();
  const userResult =
    await sql`SELECT subscription_id, status FROM users WHERE user_id = ${userId}`;
  const subscriptionId = userResult?.[0]?.subscription_id;

  if (!subscriptionId) return null;

  const subscription = await razorpay.subscriptions.fetch(subscriptionId);

  if (!subscription.current_end) {
    return {
      status: userResult?.[0]?.status,
      nextBillingDate: null, // or undefined or a default date
    };
  }

  return {
    status: userResult?.[0]?.status,
    nextBillingDate: new Date(subscription.current_end * 1000),
  };
}

export async function getLastPayment(userId: any) {
  const sql = await getDbConnection();
  const query =
    await sql`SELECT updated_at FROM payments WHERE user_id = ${userId} ORDER BY updated_at DESC LIMIT 1`;
  return query?.[0];
}
