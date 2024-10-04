# COCONUT CAMPSITE
This project includes a web application, desktop application, mobile application & KIOSK machine (Raspberry pi QR Code Scanner & Touchscreen LCD)

## Extended Xendit Class
Can be found in app -> CustomVendors

## BOOKING PAYMENT TYPE KEY
XENDIT
Booking is transacted with online payment

CASH
Booking is transacted via CASH on SITE


## TRANSACTION & XENDIT STATUS KEY
CASH_PENDING
Payment type is CASH on Site but is not paid yet

PENDING
Payment transaction for specified charge_id is awaiting payment attempt by end user

SUCCEEDED
Payment transaction for specified charge_id is successfully

FAILED
Payment transaction for specified charge_id has failed, check failure codes for reasons

VOIDED
Payment transaction for specified charge_id has been voided

REFUNDED
Payment transaction for specified charge_id has been either partially or fully refunded


## BOOKING STATUS KEY
PENDING
The booking is unpaid

PAID (Only for online transaction)
The booking is paid using online payment methods

SCANNED
The booking is scanned at KIOSK

VERIFIED
The booking is verified by the manager/campsite_owner/caretaker

## NGROK tutorial
1. In CMD, download ngrok.exe
2. add the ngrok folder to environment variable PATH
3. in cmd, enter this command: ngrok http http:localhost:8000 --url=glorious-live-marten.ngrok-free.app 

This lets the ngrok host application that listen to port 8000 which is the "Api server" of this project


## BUGS & ISSUE JOURNAL

1. Laravel Returns 401 when calling the api route in Next.JS server component | FIX: Referrer in header is missing, its stated in laravel documentation that Referrer must be included