---
layout: post
title: "The Layouts of Tomorrow"
permalink: "/blog/layouts-of-tomorrow/"
category: code, design
image: "/blog/layouts-of-tomorrow/cover.jpg"
description: "I went over to dribbble in search of fresh webdesign ideas - how hard is it to build a non-standard layout, given the modern CSS tools we have today? An experiment on CodePen."
demo: "https://codepen.io/mxbck/live/81020404c9d5fd873a717c4612c914dd"
---

If you've been to any web design talk in the last couple of years, you've probably seen this famous tweet by Jon Gold:

<blockquote class="twitter-tweet" data-lang="de"><p lang="en" dir="ltr">which one of the two possible websites are you currently designing? <a href="https://t.co/ZD0uRGTqqm">pic.twitter.com/ZD0uRGTqqm</a></p>&mdash; Jon Gold (@jongold) <a href="https://twitter.com/jongold/status/694591217523363840?ref_src=twsrc%5Etfw">2. Februar 2016</a></blockquote>

It mocks the fact that a lot of today's websites look the same, as they all follow the same standard layout practices that we've collectively decided to use. Building a blog? Main column, widget sidebar. A marketing site? Big hero image, three teaser boxes (it _has_ to be three).

When we look back at what the web was like in earlier days, I think there's room for a lot more creativity in web design today.

## Enter CSS Grid

[Grid](https://www.w3.org/TR/css-grid-1/) is the first real tool for layout on the web. Everything we had up until now, from tables to floats to absolute positioning to flexbox - was meant to solve a different problem, and we found ways to use and abuse it for layout purposes.

The point of these new tools is not to build the same things again with different underlying technology. It has a lot more potential: It could re-shape the way we think about layout and enable us to do entirely new, different things on the web.

Now I know it's hard to get into a fresh mindset when you've been building stuff a certain way for a long time. We're trained to think about websites as header, content and footer. Stripes and boxes. 

But to keep our industry moving forward (and our jobs interesting), it's a good idea to take a step back once in a while and rethink how we do things.

If we didn't, we'd still be building stuff with spacer gifs and all-uppercase `<TABLE>` tags. 😉

## So, how could things look?

I went over to dribbble in search of layout ideas that are pushing the envelope a bit. The kind of design that would make frontend developers like me frown at first sight.

There's a lot of great work out there - here's a few of my favorites:

<figure>
    <a href="https://dribbble.com/shots/1573896-Warehouse" rel="noopener noreferrer" target="_blank">
        <img src="warehouse.jpg" alt="" />
    </a>
    <figcaption>
        "Warehouse" by <a href="https://dribbble.com/Radium" rel="noopener noreferrer" target="_blank">Cosmin Capitanu</a>
    </figcaption>
</figure>

<figure>
    <a href="https://dribbble.com/shots/2375246-Fashion-Butique-slider-animation" rel="noopener noreferrer" target="_blank">
        <img src="fashion_boutique.gif" alt="" />
    </a>
    <figcaption>
        "Fashion Boutique" by <a href="https://dribbble.com/KreativaStudio" rel="noopener noreferrer" target="_blank">KREATIVA Studio</a>
    </figcaption>
</figure>

<figure>
    <a href="https://dribbble.com/shots/4316958-Organic-Juicy-Co-Landing-Page" rel="noopener noreferrer" target="_blank">
        <img src="organic_juicy.png" alt="" />
    </a>
    <figcaption>
        "Organic Juicy Co." by <a href="https://dribbble.com/broklinonjei" rel="noopener noreferrer" target="_blank">Broklin Onjei</a>
    </figcaption>
</figure>

<figure>
    <a href="https://dribbble.com/shots/1349782-Travel-Summary" rel="noopener noreferrer" target="_blank">
        <img src="travel_summary.jpg" alt="" />
    </a>
    <figcaption>
        "Travel Summary" by <a href="https://dribbble.com/p_kwiatkowski" rel="noopener noreferrer" target="_blank">Piotr Adam Kwiatkowski</a>
    </figcaption>
</figure>

<figure>
    <a href="https://dribbble.com/shots/2652364-Digital-Walls" rel="noopener noreferrer" target="_blank">
        <img src="digital_walls.gif" alt="" />
    </a>
    <figcaption>
        "Digital Walls" by <a href="https://dribbble.com/Radium" rel="noopener noreferrer" target="_blank">Cosmin Capitanu</a>
    </figcaption>
</figure>

I especially like that last one. It reminds me a bit of the "Metro Tiles" that were all the rage in Windows 8. Not only is this visually impressive, its very flexible too - I could see this working on a phone, a tablet, even on huge TV screens or in augemented reality, as suggested by the designer.

How hard is it to make something like this, given the tools we have today? I wanted to find out and started building a prototype.

I tried to approach this with real production constraints in mind. So the interface had to be responsive, performant and accessible. (It's not required to be pixel-perfect everywhere though, cause you know - [that's not a real thing](http://dowebsitesneedtobeexperiencedexactlythesameineverybrowser.com/).)

Here's how it turned out:

<div class="extend">
    <video poster="cover.jpg" width="960" style="margin:0 auto;" preload controls>
        <source src="demo.webm" type="video/webm" />
        <source src="demo.mp4" type="video/mp4" />
    </video>
</div>

You can check out <a href="https://codepen.io/mxbck/live/81020404c9d5fd873a717c4612c914dd" target="_blank" rel="noopener noreferrer">the final result</a> on Codepen.

👉 *Since this is just for demo purposes, I did not include fallbacks and polyfills for older browsers. My goal was to test the capabilities of modern CSS here, so not all features have cross-browser support (read below). I found that it works best in recent versions of Firefox or Chrome.*

Some of the things that made this interesting:

### Layout

Unsurprisingly, the essential factor for the "Metro Tiles" is the grid. The entire layout logic fits inside this block:

```scss
.boxgrid {
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-auto-rows: minmax(150px, auto);
    grid-gap: 2rem .5rem;

    &__item {
        display:flex;

        &--wide {
            grid-column: span 2;
        }
        &--push {
            grid-column: span 2;
            padding-left: 50%;
        }
    }
}
```

The magic is mostly in the second line there. `repeat(auto-fit, minmax(150px, 1fr))` handles the column creation responsively, meaning it will fit as many boxes as possible in a row to make sure they align with the outer edges.

The `--push` modifier class is used to achieve the design's effect where some boxes "skip" a column. Since this is not easily possible without explicitly setting the grid lines, I opted for this trick: The actual grid cell spans two columns, but only allows enough space for the box to fill have the cell.

### Animation

The original design shows that the section backgrounds and the tile grid move at different speeds, creating the illusion of depth. Nothing extraordinary, just some good old parallax.

While this effect is usually achieved by hooking into the scroll event and then applying different `transform` styles via Javascript, there's a better way to do it: entirely in CSS.

The secret here is to leverage CSS 3D transforms to separate the layers along the z-axis. [This technique](https://developers.google.com/web/updates/2016/12/performant-parallaxing) by Scott Kellum and Keith Clark essentially works by using `perspective` on the scroll container and `translateZ` on the parallax children:

```css
.parallax-container {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  /* set a 3D perspective and origin */
  perspective: 1px;
  perspective-origin: 0 0;
}

.parallax-child {
  transform-origin: 0 0;
  /* move the children to a layer in the background,
     then scale them back up to their original size */
  transform: translateZ(-2px) scale(3);
}
```

A huge benefit of this method is the improved performance (because it doesn't touch the DOM with calculated styles), resulting in fewer repaints and an almost 60fps smooth parallax scroll.

### Snap Points

[CSS Scroll Snap Points](https://drafts.csswg.org/css-scroll-snap/) are a somewhat experimental feature, but I thought it would fit in nicely with this design. Basically, you can tell the browser scroll to "snap" to certain elements in the document, if it comes in the proximity of such a point. Support is [quite limited](https://caniuse.com/#feat=css-snappoints) at the moment, your best bet to see this working is in Firefox or Safari.

There are currently different versions of the spec, and only Safari supports the most recent implementation. Firefox still uses an older syntax. The combined approach looks like this:

```css
.scroll-container {
    /* current spec / Safari */
    scroll-snap-type: y proximity;

    /* old spec / Firefox */
    scroll-snap-destination: 0% 100%;
    scroll-snap-points-y: repeat(100%);
}
.snap-to-element {
    scroll-snap-align: start;
}
```
The `scroll-snap-type` tells the scroll container to snap along the `y` axis (vertical) with a "strictness" of `proximity`. This lets the browser decide whether a snap point is in reach, and if it's a good time to jump.

Snap points are a small enhancement for capable browsers, all others simply fall back to default scrolling.

### Smooth Scroll

The only Javascript involved is handling the smooth scroll when the menu items on the left, or the direction arrows on top/bottom are clicked. This is progressively enhanced from a simple in-page-anchor link `<a href="#vienna">` that jumps to the selected section. 

To animate it, I chose to use the vanilla `Element.scrollIntoView()` method [(MDN Docs)](https://developer.mozilla.org/de/docs/Web/API/Element/scrollIntoView). Some browsers accept an option to use "smooth" scrolling behaviour here, instead of jumping to the target section right away.

The [scroll behaviour property](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) is currrently a Working Draft, so support is not quite there yet. Only Chrome and Firefox support this at the moment - However, there is [a polyfill](http://iamdustan.com/smoothscroll/) available if necessary.

## Think outside the box(es)

While this is just one interpretation of what's possible, I'm sure there are countless other innovative ideas that could be realized using the tools we have today. Design trends may come and go as they always have; but I truly think it's worth remembering that the web is a fluid medium. Technologies are constantly changing, so why should our layouts stay the same? Go out there and explore.

## Further Resources

* [Invision "Design Genome" Site](https://www.invisionapp.com/enterprise/design-genome) - Awesome Grid Layout
* [Layout Land](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag) - Jen Simmons' Youtube Channel
* [The New CSS Layout](https://abookapart.com/products/the-new-css-layout) - Rachel Andrew (A Book Apart)
