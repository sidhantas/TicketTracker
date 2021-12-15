
# Ticket Tracker

Initially, this project was made to help me get tickets
for the 2022 Twice concert in LA, but it can be adapted to 
virtually any concert/performance sold on vivid seats and seat geek

## Functionality

This program works by taking the backend request from seat geek 
and vivid seats and running it in the background on a server constantly.
Then, you can set it up with your email address to send you a notification
whenever prices dip below a point you are comfortable with.

Before we get started setting it up for your own personal needs, here
are the things you're going to need to get started 

* The links for the event you want to go to on Seat Geek and Vivid Seats
* The postman client
* Node version 16.* 

## How to get a source

This is kind of the hard part. In order to make a backend request, you
kind of have to find it from the website yourself. Here, I will try and go
step by step on how to find it so you, or me in the future can figure it out.

### Seat Geek

1. Go to the events url in a chromium based browser (others will probably work but I havent tried)
2. Open the developer tools tab (Inspect Element)
3. Inside of here open up the Network tab
