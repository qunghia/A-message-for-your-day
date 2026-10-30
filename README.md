# A Message for Your Day

A simple daily message website built with HTML, CSS, and JavaScript.

Each day, you can open one message made for that day.  
The message stays the same throughout the day and resets after midnight.

## Live Website

Visit:

https://qunghia.github.io/A-message-for-your-day/

## Features

- One message per day
- Message resets at 00:00
- Refreshing the page does not generate a new message
- No repeated message from the previous day
- Daily message is saved using localStorage
- Responsive design for mobile and desktop
- Minimal black-and-white interface
- Smooth message reveal animation with reduced-motion support
- Keyboard focus indicators and screen-reader message announcements
- Automatic reset at local midnight, including when returning to an open tab
- In-memory fallback when browser storage is unavailable

## How It Works

The website uses JavaScript and `localStorage` to save:

- the current date
- today's message
- the previous message

When you open a message, the browser stores it locally.

If you visit the website again on the same day, you will receive the same message.

When the date changes after midnight, a new message becomes available.

## Project Structure

```text
a-message-for-your-day/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Built With
- HTML
- CSS
- JavaScript
- GitHub Pages

## Note
The daily message is stored locally in your browser.
This means different browsers or devices may receive different messages.
Clearing browser storage will also reset the saved daily message.
If browser storage is blocked or full, messages remain available in memory while the page stays open. Reloading in this mode may generate a different message.

## Local Preview

Serve this folder with any static web server, then open it in your browser. No build step or dependencies are required.

## Author
Made by Nghia.

## Checks

With Node.js installed, run `node --test script.test.cjs` to check daily persistence, date rollover, storage recovery, and tab synchronization.
