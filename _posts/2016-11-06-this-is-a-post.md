---
layout: post
title: "This is my first Post"
permalink: "/blog/this-is-my-post/"
---

Here it is. It play aroung with some ```code``` styling.

{% highlight scss %}
.some-element {
  color:red;

  &__child {
    @include mq(md){
      width:100%;
    }
  }
}
{% endhighlight %}

{% highlight css %}
/* Pre-render the bigger shadow, but hide it */
.make-it-fast::after {
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
{% endhighlight %}

{% highlight js %}
import Link from '../Link';

function foo(){
  console.log('foo');
}
{% endhighlight %}
