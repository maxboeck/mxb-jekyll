---
layout: post
title: "CSS Skeleton Screens"
permalink: "/blog/css-skeleton-screens/"
category: "code, design"
image: "/blog/css-skeleton-screens/cover.jpg"
---

<p class="lead">Designing loading states on the web is often overlooked, or dismissed as an afterthought. Performance is not only a developer's responsibility - building an experience that works with slow connections is a design challenge too.</p>

## The illusion of speed

As our expectations for mobile experiences change, so does our understanding of performance. People expect web apps to feel as snappy and responsive as native apps, regardless of their current situation. 

For a developer, this requires attention to things like minification, caching, and the performance budget. For a designer, the loading state is a lot about managing expectations and keeping the user informed.

[Perceived performance](http://blog.teamtreehouse.com/perceived-performance) is a measure of how fast something **feels** to the user. The idea is that users are more patient and will think of a system as faster, if they know what's going on and can anticipate content before it's actually there. 

![speech bubble typing animation](typing.gif)

Nobody likes to wait for the unknown - that's why you see a typing indicator in chat applications, resembling the incoming message. While a simple loading spinner would communicate the state too, this adds an extra layer of usefulness. It says:

> "Something is about to happen, and here's what to expect".

In other apps, this concept might include displaying "mockups" of text, images or other content elements - called **skeleton screens** 💀. 

You can find these in the wild, being used by big names like Facebook, Google, Slack and others:

<figure>
  <img src="slack-skeleton.jpg" alt="Screenshot of slack app using skeletons" style="box-shadow:0 0 32px rgba(0,0,0,.1)">
  <figcaption>Holy moly to you too, Slack.</figcaption>
</figure>

## An Example

Say you are building a web app. It's a travel-advice kind of thing where people can share their trips and recommend places, so your main piece of content might look something like this:

<p class="text--center">
  <img src="card.jpg" alt="card UI of a travel article">
</p>

You can take that card and reduce it down to its basic visual shapes, the *skeleton* of the UI component.

<p class="text--center">
  <img src="card-skeleton.jpg" alt="skeleton version of the same card, outlined in gray rectangles">
</p>

Whenever someone requests new content from the server, you can immediately start showing this skeleton, while data is being loaded in the background. Once the content is ready, simply swap the skeletons for the actual cards. If you're building a [Progressive Web App](https://mxb.at/blog/how-to-turn-your-website-into-a-pwa/), you might even want to cache the "App Shell" (stuff like the header bar, navigation, etc.) for offline use.

Now you could use an image to display the skeleton, but that would introduce an additional request and data overhead. We're already loading stuff here, so it's not a great idea to wait for another image to load first. Plus, if we ever decided to adjust some of the content card's styling, we would have to duplicate the changes to the skeleton image so they'd match again. 😒 Meh.

A better solution is to create the whole thing with just CSS. No extra requests, minimal overhead, responsive, not even any additional markup. And we can build it in a way that makes changing the design later much easier.

## Drawing Skeletons in CSS

First, we need to draw the basic shapes that will make up the card skeleton. We can do this by adding different [gradients](https://www.w3schools.com/cssref/func_linear-gradient.asp) to the `background-image` property. By default, linear gradients run from top to bottom, with different color stop transitions. If we just define one color stop and leave the rest transparent, we can draw shapes.

Keep in mind that multiple background-images are stacked on top of each other here, so the order is important. The last gradient definition will be in the back, the first at the front.

```css
.skeleton {
  background-repeat: no-repeat;
  background-image: 
    /* layer 2: avatar */
    /* white circle with 16px radius */
    radial-gradient(circle 16px, white 99.99%, transparent 0),
    /* layer 1: title */
    /* white rectangle with 40px height */
    linear-gradient(white 40px, transparent 0),
    /* layer 0: card bg */
    /* gray rectangle that covers whole element */
    linear-gradient(gray 100%, transparent 0);
}
```

These shapes stretch to fill the entire space, just like regular block-level elements. If we want to change that, we'll have to define explicit dimensions for them. The value pairs in `background-size` set the width and height of each layer, keeping the same order we used in `background-image`:

```css
.skeleton {
  background-size:
    32px 32px,  /* avatar */
    200px 40px, /* title */
    100% 100%;  /* card bg */
}
```

The last step is to position the elements on the card. This works just like `position:absolute`, with values  representing the `left` and `top` property. We can for example simulate a padding of 24px for the avatar and title, to match the look of the real content card.

```css
.skeleton {
  background-position:
    24px 24px,  /* avatar */
    24px 200px, /* title */
    0 0;        /* card bg */
}
```

## Break it up with Custom Properties

This works well in a simple example - but if we want to build something just a little more complex, the CSS quickly gets messy and very hard to read. If another developer was handed that code, they would have no idea where all those magic numbers are coming from. Maintaining it would surely suck.

Thankfully, we can now use [custom properties](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/) to write the skeleton styles in a much more concise, developer-friendly way - and even take the relationship between different values into account:

```css
.skeleton {
  /*
    define as separate properties
  */
  --card-height: 340px;
  --card-padding:24px;
  --card-skeleton: linear-gradient(gray var(--card-height), transparent 0);
  
  --title-height: 32px;
  --title-width: 200px;
  --title-position: var(--card-padding) 180px;
  --title-skeleton: linear-gradient(white var(--title-height), transparent 0);

  --avatar-size: 32px;
  --avatar-position: var(--card-padding) var(--card-padding);
  --avatar-skeleton: radial-gradient(
    circle calc(var(--avatar-size) / 2), 
    white 100%, 
    transparent 0
  );

  /* 
    now we can break the background up 
    into individual shapes 
  */
  background-image: 
    var(--avatar-skeleton),
    var(--title-skeleton),
    var(--card-skeleton);

  background-size:
    var(--avatar-size),
    var(--title-width) var(--title-height),
    100% 100%;

  background-position:
    var(--avatar-position),
    var(--title-position),
    0 0;
}
```
Not only is this a lot more readable, it's also way easier to change some of the values later on.
Plus we can use some of the variables (think `--avatar-size`, `--card-padding`, etc.) to define the styles for the actual card and always keep it in sync with the skeleton version.

Adding a media query to adjust parts of the skeleton at different breakpoints is now also quite simple:
```css
@media screen and (min-width: 47em){
  --card-padding: 32px;
  --card-height: 360px;
}
```

Caveat: [Browser support](http://caniuse.com/#feat=css-variables) for custom properties is good, but not at 100%. Basically all modern browsers have support, with IE/Edge a bit late to the party. For this specific usecase, it would be easy to add a fallback using Sass variables though.

## Add Animation

To make this even better, we can animate our skeleton *[insert necromancer joke here]*, and make it look more like a loading indicator. All we need to do is put a new gradient on the top layer and then animate its position with `@keyframes`.

Here's a full example of how the finished skeleton card could look:

<div class="extend">
  <p data-height="450" data-theme-id="dark" data-slug-hash="EvmLVp" data-default-tab="css,result" data-user="mxbck" data-embed-version="2" data-pen-title="Skeleton Loading Card" class="codepen">
  <a href="https://codepen.io/mxbck/pen/EvmLVp/">Skeleton Loading Card</a> by Max Böck (<a href="https://codepen.io/mxbck">@mxbck</a>) on <a href="https://codepen.io">CodePen</a>.</p>
  <script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
</div>

💡 Pro Tip: Use the `:empty` selector and a pseudo element to draw the skeleton, so it only applies to empty card elements. Once the content is injected, the skeleton screen will automatically disappear.

## More on this

* Designer VS. Developer #8: [Designing for Great Performance](https://www.youtube.com/watch?v=551nfxay-M4)
* Vince Speelman: [The Nine States of Design](https://medium.com/swlh/the-nine-states-of-design-5bfe9b3d6d85)
* Harry Roberts: [Improving Perceived Performance with Multiple Background Images](https://csswizardry.com/2016/10/improving-perceived-performance-with-multiple-background-images/)
* Sitepoint: [A Designer’s Guide to Perceived Performance](https://www.sitepoint.com/a-designers-guide-to-fast-websites-and-perceived-performance/)