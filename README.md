# mxb.at
Personal Website

Source code for [mxb.at](https://mxb.at), my portfolio website and blog based on Jekyll.
Basic ingredients:

* Jekyll Static Files
* BEM-flavoured CSS (w/ Critical Path Inlining)
* Vanilla JS (ES6 / Babel)
* System Fonts & FontFaceObserver
* Offline Support w/ Service Worker
* Focus on Speed and Accessibility

For a more detailed description, please read [The Relaunch Post](https://mxb.at/blog/the-relaunch-post/) on my blog. 

## Installation

This site runs on [Jekyll](https://jekyllrb.com/docs/installation/#requirements), so you will need Ruby in version 2.2.5 or higher. There are two types of dependencies necessary to get started:

Ruby dependencies (Gems) are managed with bundler. Navigate to the root directory with the site's `Gemfile`, then do:

```bash
$ gem install bundler jekyll
$ bundle install
```

Assuming you have node and NPM installed on your machine, then do:

```bash
$ npm install
```

## Getting Started

The local development environment uses gulp to run various tasks for the site. These gulp scripts are found in the `_tasks` directory. Here are the most important ones:

`gulp serve` or just `gulp`: spin up a local server for the site. Includes live reloading.

`gulp build`: builds the whole thing into the `_site` directory for development.

`gulp build:prod`: makes a production ready build, including critical path CSS, service worker caching and all that good stuff.