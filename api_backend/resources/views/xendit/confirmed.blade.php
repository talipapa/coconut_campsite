<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment confirmation</title>
</head>
<body>
    <p>Reference id: {{$transaction->id}}</p>
    <p>Hello, {{$booking->first_name}} {{$booking->last_name}}</p>
    <p>Your payment amounting of P{{$transaction->price + $transaction->fee}} has been received.</p>
    <p>Thank you for booking in our campsite! <a href="https://maps.app.goo.gl/opJGxp3aSqTqSxDi8">See you soon!</a></p>
</body>
</html>