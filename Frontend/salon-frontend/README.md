# Shreyanshu - Salon Booking Frontend (complete, ready to run)

## Run it
Windows: double-click  start.bat
Mac/Linux:  ./start.sh

or manually:   npm install   then   npm run dev      ->  http://localhost:3000

The API address is in the .env file (VITE_API_GATEWAY=http://localhost:8090).
Change it only if your gateway runs somewhere else.

## Booking flow in this version
1. Customer picks services, a day and a time (past times and taken times are greyed out).
2. Customer pays with Razorpay or Stripe.
3. The server verifies the payment -> the booking shows
   "Paid - waiting for salon to confirm".
4. The owner gets a notification and sees Confirm / Decline on the Bookings page.
5. The customer is notified of the decision; the owner Overview recalculates.

If the payment page says "We couldn't confirm that", it also prints a
"Reason:" line - send that line when asking for help.

This frontend needs the matching backend files from complete-fix.zip
(payment-service, booking-service, notification) to be installed and restarted.
