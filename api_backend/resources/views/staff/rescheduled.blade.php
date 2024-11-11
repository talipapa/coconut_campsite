<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your booking has been rescheduled by Coconut Campsite</title>
</head>
<body>
    <p>Reference id: {{$transaction->id}}</p>
    <p>Hello, {{$booking->first_name}} {{$booking->last_name}}</p>
    <div>
        <p>We are sorry to inform you that your booking on {{$oldDate}}has been rescheduled to {{$newDate}}.</p>
    </div>
    <p>We hope to see you inn the designated check in soon! <a href="https://maps.app.goo.gl/opJGxp3aSqTqSxDi8">See you!</a></p>
</body>
</html>