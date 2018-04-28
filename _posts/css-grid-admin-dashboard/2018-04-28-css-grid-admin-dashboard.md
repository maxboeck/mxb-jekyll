---
layout: post
title: "CSS Grid Admin Dashboard"
permalink: "/blog/css-grid-admin-dashboard/"
category: code
image: "/blog/css-grid-admin-dashboard/cover.jpg"
description: "A closer look at how CSS grid layout can be used in production today, including fallback styles for flexbox."
---

<p class="lead">Good News! Lorem Ipsum dolor sit amet ex fgshaur hsund gwpasm,rtzis, et sonhauzg rt aszdp.</p>

<figure class="extend">
  <a href="https://caniuse.com/#search=grid">
    <img src="caniuse_grid.png" alt="Support Statistics for CSS Grid Layout" />
  </a>
  <figcaption>Grid support as of 04/18. Look at all that green.</figcaption>
</figure>

The tools are ready - let's use them.

So, what can we build with this? I've used grid on several production projects now, and I found that it really makes building some layouts a lot easier. I've put together a small demo here to show possible applications of CSS grids and how to make them work cross-browser. 

👉 *Only after the code? You can find the [full demo on Codepen](https://codepen.io/mxbck/pen/5be32fd8e3ca7b6b2f5108ba7d22debd).*

## Building an Admin Interface

We're going to build a pretty common layout for the backend of an application, where admins or editors can manage their content:

<figure class="extend">
    <a href="https://codepen.io/mxbck/pen/5be32fd8e3ca7b6b2f5108ba7d22debd" target="_blank" rel="noopener noreferrer">
        <img src="admin.png" alt="An admin interface layout demo" />
    </a>
</figure>

By looking at the design above, we can already imagine the underlying grid. Unlike "regular" websites, these admin screens often have a lot of fixed UI elements that span the entire viewport, and only the main content area is scrollable.

Defining the basic layout is pretty straightforward - we just need to set our `rows` and `columns`. Basically, the interface consists of four parts:

* Header
* Navigation
* Main Content Area
* Footer 

We can define the heights and widths using the `grid-template` property. The `1fr` (= one fraction) is similar to `flex-grow`: it tells the browser to distrubute any leftover space equally to the middle row, so the main content takes up all available space.

```scss
$admin-header-height: 70px;
$admin-footer-height: 70px;
$admin-nav-width: 250px;

.admin {
  display: grid;
  height: 100vh;
  
  grid-template-rows:     $admin-header-height 1fr $admin-footer-height;
  grid-template-columns:  $admin-nav-width 1fr;
  grid-template-areas:    "header  header"
                          "nav    main"
                          "footer footer";
}
```
Finally, the `grid-template-areas` here is just a convienience rule to let us name the parts of our grid to something a bit more readable. After doing that, we can assign all grid-items to their position on the grid. The visual placement should generally follow the source order.

```css
.header {
  grid-area: header;
}
```

## Nested Grids: The Dashboard

We can nest another grid inside our main content area to display the dashboard. Here's a common design pattern where different statistics and widgets are displayed in a card grid:

![Grid Layout for the dashboard view](dashboard_grid.png)

This time, rather than explicitly defining our rows and columns, we'll leave that open. We'll just tell the browser how many columns we want, and to space them out evenly. When more items are placed on the grid, the container can just generate additional grid tracks on the fly. This ["implicit" grid](https://www.w3.org/TR/css-grid-1/#implicit-grids) will accommodate any amount of content we may want to display.

💡 Pro Tip: By using a CSS custom property for the column count, we can easily switch from a 2-col to a 4-col grid on larger screens.

```scss
.dashboard {
  --column-count: 2;
  
  display: grid;
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-gap: 2rem;
  
  &__item {
    // per default, an item spans two columns.
    grid-column-end: span 2;
    
    // smaller items only span one column.
    &--half {
      grid-column-end: span 1;
    }
    // full-width items span the entire row.
    // the numbers here refer to the first and last grid lines.
    &--full {
      grid-column: 1 / -1;
    }
  }
  
  @media screen and (min-width: 48rem) {
    --column-count: 4;
  }
}
```

## But what about {legacy browser} ?

Yes, yes I know, we need to support IE11. We need to support older mobile browsers. That's why we can't have nice things. 

Fortunately, it's possible to build a Flexbox fallback and progressively enhance from there! The layout remains usable, and more capable browsers get all that grid goodness 👌. 

We dont even need a media query here, as the grid properties will simply override all flexbox definitions, if they're supported. If not, the browser will ignore them.

```scss
.admin {
  // define flexbox fallback first.
  display: flex;
  flex-wrap: wrap;

  // then add the grid definition.
  display: grid;
  ...

  &__header,
  &__footer {
    flex-basis: 100%;
  }
  &__nav {
    flex-basis: $admin-nav-width;
  }
  &__main {
    flex: 1;
  }
}
```

For the dashboard card grid fallback, things are slightly more complex. We have to account for the missing `grid-gap` property, so we'll have to fake the spacing with margins and paddings:

```scss
.dashboard {
  display: flex;
  flex-wrap: wrap;
  // offset the outer gutter with a negative margin.
  margin: 0 -1rem;

  &__item {
    flex: 1 1 50%;
    // this will add up to a 2rem gap between items.
    padding: 1rem;
  }
}
```

Since these fallback gaps will mess with our layout if we **do** have grid support, we need a small reset to restore the original grid. [Detecting support](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) can be done using the `@supports` rule:

```scss 
@supports (display: grid) {
  .dashboard {
    margin: 0;
  }
  .dashboard__item {
    padding: 0;
  }
}
```

👉 *Check out the [full demo on Codepen!](https://codepen.io/mxbck/pen/5be32fd8e3ca7b6b2f5108ba7d22debd)*

## Further Reading

* Rachel Andrew: ["The New CSS Layout"](https://abookapart.com/products/the-new-css-layout) (A book apart)
* Una Kravets: ["Grid To Flex", Common layouts built with grid](http://www.gridtoflex.com/)
* Manuel Matuzović: [Progressively Enhancing CSS Layout: From Floats To Flexbox To Grid](https://www.smashingmagazine.com/2017/07/enhancing-css-layout-floats-flexbox-grid)