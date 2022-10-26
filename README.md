NOTE: This repo contains free version features.

![image](https://user-images.githubusercontent.com/14031295/170217467-01249753-6213-40c1-87b6-c39aa762f6cf.png)

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
- Add overlay text($$)
- Add image as background($$)
- Add custom watermark($$)

`($$)` are paid features and not available in this repo's code.

## Setting up the app

First, run the development server:

- Clone the repo
- Setup with `yarn`
- Run dev server with `yarn dev`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- File located at `/components/main` contains the code for canvas and the stylings

## Built using

- Next.js
- TailwindCSS

## License

[Here](https://github.com/rishimohan/pika/blob/main/license.md)

## Assets

![pika-filled-circle](https://user-images.githubusercontent.com/14031295/198069686-4b0853cf-f11f-4aab-9ceb-08c37f61a459.png)


