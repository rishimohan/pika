NOTE: This repo contains free version features.

## What is Pika?

Pika is a web app to transform RAW screenshots 
into beautiful images, which you would be proud to share
on your landing pages, emails, Twitter or marketing pages.

The main goal behind Pika is to fasten this process
of designing screenshots.

## How Pika works?

Pika uses `dom-to-image` to generate an image from
a DOM element. The DOM element is the canvas 
with your screenshot and all the stylings.
Stylings are done using mix of inline CSS and Tailwind CSS.

## How Pika makes designing screenshot quick?

- Pika saves your options locally on your machine, so when you open the app next time it keeps your previous settings
- Pika gives you shortcuts: 
  - Ctrl/Cmd+V: paste a screenshot
  - Ctrl/Cmd+C: copy the output image
  - Ctrl/Cmd+S: save the output image

## What all you can do with Pika?

- Apply rounded corners to your screenshot
- Apply background gradients
- Control screenshot position in canvas, add padding
- Add shadow to screenshot
- Add noise to background to add RAW vibes

## Build using

- Next.js
- TailwindCSS

## Setting up the app

First, run the development server:

- Clone the repo
- Setup with `yarn`
- Run dev server with `yarn dev`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- File located at `/components/main` contains the code for canvas and the stylings
