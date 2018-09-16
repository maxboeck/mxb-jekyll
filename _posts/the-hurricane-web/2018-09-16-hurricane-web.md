---
layout: post
title: "The Hurricane Web"
permalink: "/blog/hurricane-web/"
category: general
image: "/blog/hurricane-web/npr.png"
---

As Hurricane Florence makes its way across the US southeast coast, many people are stuck in areas with severe flooding. These people rely on outside information, yet have limited bandwidth and power.

To help them, news platforms like [CNN](http://lite.cnn.io/en) and [NPR](https://text.npr.org/) provide text-only versions of their sites:

<blockquote class="twitter-tweet" data-partner="tweetdeck"><p lang="en" dir="ltr">We have a text-only version of our website for anyone who needs to stay up-to-date on Hurricane Florence news and keep their battery and data usage to a minimum: <a href="https://t.co/n2UDDKmlja">https://t.co/n2UDDKmlja</a></p>&mdash; NPR (@NPR) <a href="https://twitter.com/NPR/status/1040580925329948673?ref_src=twsrc%5Etfw">September 14, 2018</a></blockquote>

That's a great thing. Here's how it looks:

<a href="https://text.npr.org/">
    <img src="npr.png" style="border:1px solid #DDD;" alt="Screenshot of the NPR text-only site">
</a>   

## Less is More

Text-only sites like these are usually treated as a <abbr title="Minimum Viable Prototype">MVP</abbr> of sorts. A slimmed-down version of the real site, specifically for emergencies. 

I'd argue though that in some aspects, they are actually better than the original. Think about it- that simple NPR site gets a lot of points right:

* It's pure content, without any distractions
* It's almost completely fail-safe
* It's responsive by default and will work on any device
* It passes AA accessibility standards 
* It's search engine friendly
* It's machine readable and translatable 
* It has close to perfect performance scores:

<figure>
    <img src="lighthouse-npr.png" alt="Google Lighthouse Report for text.npr.org">
    <figcaption>The site needs exactly one request (the HTML), weighs in under 5KB and loads in about one second on a low-bandwidth 2g connection.</figcaption>
</figure>

The only thing missing here might be a few sensible lines of CSS to set better typography rules. Those could still be inlined in the head though, easily coming in under the 14KB bar for the first connection roundtrip.

This is the web as it was originally designed. Pure information, with zero overhead. Beautiful in a way.

<img src="requests-npr.png" alt="" />

The "full" site in comparison takes __~124 requests__ and weighs close to __5MB__ on average. Time to first paint is around 20 seconds on slow connections. It includes ads, analytics, tracking scripts and social media widgets.

Meanwhile, the actual news content is roughly the same. The articles are identical - apart from some complementary images, they convey exactly the same information. 

## The Cost of Comfort

Of course the main NPR site offers a lot more than just news, it has all sorts of other features. It has live radio, podcasts, video and more. But all that comes at a price.

I recently read [this great article](https://infrequently.org/2018/09/the-developer-experience-bait-and-switch/) by Alex Russel, in which he compares Javascript to CO<sub>2</sub> - in the sense that too much of it can be harmful to the ecosystem.

Javascript enables us to do amazing things and it can really enhance the user experience, if done right. But it always has a cost. It's [the most expensive way](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/) to accomplish a task, and it's also the most fragile. It's easy to forget that fact when we develop things on a highspeed broadband connection, on our state-of-the-art devices.

That's why websites built for a storm do not rely on Javscript. The benefit simply does not outweigh the cost.

That NPR site is a very useful thing that serves its purpose, and it does so in the simplest, most efficient way possible. Personally, I'd love to see more distilled experiences like this on the web.

> "Well, this might work for a news site - but not every usecase is that simple."

...I hear you say. 

True. The web is a text-based medium, and it works best with that type of content. But the basic approach is still valid in any other scenario: 

Figure out what the main thing is people want from your site and deliver it - using the simplest, least powerful technology available.
(W3C, ["The Rule of Least Power"](https://www.w3.org/2001/tag/doc/leastPower.html))

Make it withstand hurricanes.

👉 _BTW: This post is not meant to criticize the main NPR website in any way, which is actually very well made. It's more of a general thought on how we deliver and prioritize content on the web._