<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your transaction has been refunded</title>
</head>
<body>
    <p>Reference id: {{$transaction->id}}</p>
    <p>Hello, {{$booking->first_name}} {{$booking->last_name}}</p>
    <p>Your payment amounting of P{{$refundAmount}} has been refunded.</p>
</body>
</html>