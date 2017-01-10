---
layout: post
title: "Javascript Defering Snippet"
permalink: "/blog/javascript-defering-snippet/"
category: code
---

<p class="lead">
I came across <a href="http://www.feedthebot.com/pagespeed/defer-loading-javascript.html">this technique</a> a while ago, and I've been using it ever since to defer loading of non-ciritcal scripts. 
</p>

What it does is simple: it's a bullet-proof way to ensure that these scripts begin loading only _after_ the main page is done.

``` js
  function insert(src, id){
    var d = document;
    var js, fjs = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) return;
    js = d.createElement('script'); 
    js.id = id;
    js.src = src;
    fjs.parentNode.insertBefore(js, fjs);
  }
  function defer() {
    insert("/path/to/stuff.js", "defered");
  }
  if (window.addEventListener)
    window.addEventListener("load", defer, false);
  else if (window.attachEvent)
    window.attachEvent("onload", defer);
  else window.onload = defer;
```

I usually include this snippet right before the closing `</body>` tag to load external APIs like Google Analytics, Facebook or Twitter. In most cases, rendering a "Like" Button can wait until after page load, without the associated performance hit.

You can see it in action on this very page, where it loads analytics and some polyfills.
Go check it out in your devtools if you want ;)