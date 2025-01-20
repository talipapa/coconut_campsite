# COCONUT CAMPSITE
This project includes a web application, desktop application, mobile application & KIOSK machine (Raspberry pi QR Code Scanner & Touchscreen LCD)

## Extended Xendit Class
Can be found in app -> CustomVendors

## BOOKING PAYMENT TYPE KEY
OVERNIGHT
Booking is for overnight

DAYTOUR
Booking is for day tour


## TRANSACTION & XENDIT STATUS KEY
CASH_PENDING
Payment type is CASH on Site but is not paid yet

PENDING
Payment transaction for specified charge_id is awaiting payment attempt by end user

SUCCEEDED
Payment transaction for specified charge_id is successfully

FAILED
Payment transaction for specified charge_id has failed, check failure codes for reasons

CANCELLED
Payment transaction is CANCELLED (status only available for cash payment method)

REFUND_PENDING
Transaction status if there's no response from webhook yet (Attempt to fix bug)

VOIDED
Payment transaction for specified charge_id has been voided

REFUNDED
Payment transaction for specified charge_id has been either partially or fully refunded

VERIFIED
The booking is verified by the manager/campsite_owner/caretaker

## BOOKING STATUS KEY
PENDING
The booking is unpaid

PAID (Only for online transaction)
The booking is paid using online payment methods

CASH_PENDING
Payment type is CASH on Site but is not paid yet

CASH_CANCELLED
The booking is cancelled (status only available for cash payment method)

VOIDED
The booking is refunded

REFUNDED
The booking is refunded

SCANNED
The booking is scanned at KIOSK

FAILED
The booking is not refunded, voided or cash_cancelled (NO SHOW)

VERIFIED
The booking is verified by the manager/campsite_owner/caretaker

CANCELLED
Payment bookinng is CANCELLED 

## Important ENV & Credentials or else, the system won't work
1. OwnerMobile/credentials.json
2. OwnerMobile/google-services.json
3. api_backend/.env



## NGROK tutorial
1. In CMD, download ngrok.exe
2. add the ngrok folder to environment variable PATH
3. in cmd, enter this command: ngrok http http://localhost:8000 --url=glorious-live-marten.ngrok-free.app

This lets the ngrok host application that listen to port 8000 which is the "Api server" of this project

## Desktop API change
To switch api server host, just go to desktop/src/utils/auth.ts

## BUGS & ISSUE JOURNAL

1. Laravel Returns 401 when calling the api route in Next.JS server component | FIX: Referrer in header is missing, its stated in laravel documentation that Referrer must be included

2. The website (specifically /view-booking page) will always assume and pull a price from the database. Which causes an error if the database is not populated. Make sure to run "php artisan db:seed" to generate default prices.

3. Due to CORS error in local machine: Mobile can't connect to localhost:8000 but works with 192.168.2.106(local ip address), Website can connect to localhost:8000 but won't connect with 192.168.2.106(local ip address). This means, you can't run website and mobile at the same local network in development environment.


## Building react native
https://docs.expo.dev/develop/development-builds/create-a-build/

## Laravel forge important notes
1. Deployment script
```
cd /home/forge/server.coconutcampsite.com/api_backend
git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# php artisan migrate:fresh --force
# php artisan db:seed --force
```

2. Laravel necessary variables
```
APP_NAME="Coconut Campsite"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://server.coconutcampsite.com
FRONTEND_URL=https://coconutcampsite.com
SESSION_SAME_SITE=none
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=coconutcampsite.com,api.coconutcampsite.com
SESSION_DOMAIN=.coconutcampsite.com
XENDIT_SUCCESS_URL=https://coconutcampsite.com/view-booking
XENDIT_FAILURE_URL=https://coconutcampsite.com/booking
XENDIT_CANCEL_URL=https://coconutcampsite.com/booking
APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US
APP_MAINTENANCE_DRIVER=file
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
BCRYPT_ROUNDS=12
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug
BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database
CACHE_PREFIX=
MEMCACHED_HOST=127.0.0.1
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379


XEMAPHORE_SECRET_KEY=
XEMAPHORE_SENDER_NAME=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false
VITE_APP_NAME=${APP_NAME}
XENDIT_SECRET_KEY=
XENDIT_PUBLIC_KEY=
XENDIT_WEBHOOK_VERIFICATION_TOKEN=
XENDIT_BUSINESS_ID=
```

3. Since the laravel backend is not rooted on main, the Web directory for Laravel forge should be the following:
```
/api_backend/public
```



## POLICY NOTE
1. Refund are 100% returned if the refund requests didn't reached the xendit cutoff (23:50) in the same day of making the transaction.
2. If refund has reached the void cut-off, The campsite will deduct 10% off, which will be used to cover for xendit service fee`s.
3. The campsite can refund transaction made with e-payment (xendit), but will require a valid and reasonable reason. 

