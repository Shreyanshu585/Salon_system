import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { paymentsApi } from "@/api/payments";
import { LinkButton } from "@/components/ui/Button";

export default function PaymentSuccessPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [reason, setReason] = useState("");

  // React's dev mode runs effects twice - verify only once.
  const verifiedOnce = useRef(false);

  const razorpayPaymentId = searchParams.get("razorpay_payment_id") ?? "";
  const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id") ?? "";
  const stripeSessionId = searchParams.get("session_id") ?? "";

  useEffect(() => {
    if (verifiedOnce.current) return;
    verifiedOnce.current = true;

    const isRazorpay = razorpayPaymentId && razorpayPaymentLinkId;

    if (!isRazorpay && !orderId) {
      setReason("The payment details are missing from the page address.");
      setStatus("failed");
      return;
    }

    // Razorpay sends its own ids back. Anything else is a Stripe return,
    // which the server verifies by asking Stripe directly.
    const request = isRazorpay
      ? paymentsApi.proceed(razorpayPaymentId, razorpayPaymentLinkId)
      : paymentsApi.proceedStripe(orderId, stripeSessionId);

    request
      .then((confirmed) => {
        if (confirmed) {
          setStatus("success");
        } else {
          setReason("The payment provider says this payment hasn't been completed.");
          setStatus("failed");
        }
      })
      .catch((err) => {
        // show the real reason instead of a generic message
        setReason(err?.response?.data?.message || err?.message || "Unknown error.");
        setStatus("failed");
      });
  }, [razorpayPaymentId, razorpayPaymentLinkId, stripeSessionId, orderId]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
      {status === "checking" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-moss-500" />
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Confirming your payment…</h1>
          <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">Hang tight — we're verifying this.</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-moss-100 dark:bg-moss-900/40">
            <CheckCircle2 className="h-8 w-8 text-moss-600 dark:text-moss-300" />
          </div>
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">Payment received!</h1>
          <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">
            Your booking is now waiting for the salon to confirm it. You'll see the status in My bookings.
          </p>
          <LinkButton to="/bookings">View my bookings</LinkButton>
        </>
      )}
      {status === "failed" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay-100 dark:bg-clay-900/40">
            <XCircle className="h-8 w-8 text-clay-600 dark:text-clay-300" />
          </div>
          <h1 className="font-display text-2xl text-ink-900 dark:text-cream">We couldn't confirm that</h1>
          <p className="max-w-sm text-sm text-ink-500 dark:text-ink-400">
            If money was deducted, it'll be refunded — check your bookings or try again.
          </p>
          {reason && (
            <p className="max-w-md rounded-lg bg-clay-50 px-4 py-2 text-xs text-clay-700 dark:bg-clay-900/30 dark:text-clay-200">
              Reason: {reason}
            </p>
          )}
          <LinkButton to="/bookings" variant="outline">View my bookings</LinkButton>
        </>
      )}
    </div>
  );
}
