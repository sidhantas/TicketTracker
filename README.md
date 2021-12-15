
# Ticket Tracker

Initially, this project was made to help me get tickets
for the 2022 Twice concert in LA, but it can be adapted to 
virtually any concert/performance sold on vivid seats and seat geek

## Initial setup

Setup the environment by executing

    yarn

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
* A small amount of network knowledge

## How to get a source

This is kind of the hard part. In order to make a backend request, you
kind of have to find it from the website yourself. Here, I will try and go
step by step on how to find it so you, or me in the future can figure it out.

### Seat Geek

1. Go to the events url in a chromium based browser (others will probably work but I havent tried)
2. Open the developer tools tab (Inspect Element)
3. Inside of here open up the Network tab
4. Refresh the page, and you should see network packets start to flood in
5. Using the time slider, scroll through the packets slowly, and try and find one along the lines of "event_listings_v2", it'll be a lot longer
6. Right click on this packet and click copy->Copy as cURL (bash)
7. Open up Postman
8. Import a cURL command with Ctrl + O
9. Paste into the raw text tab and press open
10. Convert it into an axios config by opening up the code panel (located on the right as of right now) and selecting Nodejs - Axios from the dropdown
11. Copy ONLY the config from the output code and replace the config variable in "seat_geek_headers.js"


### Vivid Seats

1. Same as 1-4 from Seat Geek
2. Same as 5 from seat geek except the packet is something like "listings?productionId"
3. Same as 6-10 from Seat Geek
4. Same as 11 from Seat Geek except replace the config variable in "vivid_seats_headers.js"

## Choosing Seats and Prices

You should now have both the sources, now you need to choose the seats and prices you want.

To do so modify the file, "seats_wanted.config", or create the file if it doesn't exist. 
Every line of the file is an input of the seats, price, and number of tickets you want.

### There are 2 forms of entries

#### Number based entries

These are used for sections that use numbers as their identifier. These have 4 arguments

The line goes as follows:

    lower_seat_number upper_seat_number price minimum_tickets

The program will search for any sections between these ranges (inclusive) that are less than or equal to the price and
greater than or equal to the number of tickets

#### Floor based entries

These are for sections that use strings as an identifier. For example, "Floor B", also used for "Floor 3" even though 3 is a number. 

The entry is as follows:

    section price minimum tickets

Spaces in the Floor name should have underscores, so "Floor B" is actually "Floor_B"

Each floor section has it's own entry.

## .env variables

There are 3 environment variable that are needed for this program to work, and they are used to send
a mail to you once the price hits your target

    EMAIL_USER=YOUR_EMAIL
    EMAIL_PASS=YOUR_EMAIL_PASSWORD
    RECEIVER_EMAIL=THE_RECIPIENTS_EMAIL

The receiver email can also be a phone number if you use these email addresses based on the carrier

AT&T: phonenumber@txt.att.net

T-Mobile: phonenumber@tmomail.net

Sprint: phonenumber@messaging.sprintpcs.com

Verizon: phonenumber@vtext.com or phonenumber@vzwpix.com

Virgin Mobile: phonenumber@vmobl.com


## Running the program

Everything should be setup so you can run the program with

    yarn start

If there is a ticket within your requirements, an email will be sent

## cronjob

For this program to be run in the background, I ran it on a server with a cronjob. To make my cron entry I set it up as follows

    crontab -e

Choose your editor if needed, other wise, at the bottom of the file create an entry like this

    * * * * * cd ~/path/to/program/ && /bin/node index.js

This will run the program every minute, but you can edit the cronjob to your liking.

