# _Nicegist_ - a permanent gist.io alternative

> writing for hackers · zero setup · publish in seconds

**A pure JavaScript gist.io replacement, hosted on GitHub***.

_* As long as GitHub exists, it will not die. Yay!_

## About

When I recognized that [gist.io](https://github.com/idan/gistio) is dead, I stumbled upon [a comment](https://github.com/idan/gistio/issues/74#issuecomment-348884248) in gist.io's issue tracker, that suggested to build a pure JavaScript implementation to be hosted on GitHub pages.

I liked the idea. Thus, _Nicegist_ was born.

## Usage

1. Create a gist on Github with one or more Markdown-syntax files.
2. Note the gist ID. (It's usually a longish number like 29388372.)
3. View your writing presented nicely at eyecatchup.github.io/nicegist/?id=GIST_ID

**Examples:**

- Code blocks: [Nicegist](https://eyecatchup.github.io/nicegist/?id=2f35faad4d4fa55810422283f7bc3b78), [Source](https://gist.github.com/eyecatchup/2f35faad4d4fa55810422283f7bc3b78)
- Tables: [Nicegist](https://eyecatchup.github.io/nicegist/?id=79b95b862ca276c0748c9bab90a758e0), [Source](https://gist.github.com/eyecatchup/79b95b862ca276c0748c9bab90a758e0)
- Embedded gists: [Nicegist](https://eyecatchup.github.io/nicegist/?id=3382937), [Source](https://gist.github.com/surma/3382937)
- Text formatting, images & more: [Nicegist](https://eyecatchup.github.io/nicegist/?id=96e67c2dd38419b200f9efcd56c2e8e3), [Source](https://gist.github.com/eyecatchup/96e67c2dd38419b200f9efcd56c2e8e3)
- Example writeup: [Nicegist](https://eyecatchup.github.io/nicegist/?id=dab5cf7977008e504213), [Source](https://gist.github.com/eyecatchup/dab5cf7977008e504213)


## Features

- Supports public and secret gists
- Supports CommonMark / GFM syntax
- Automated code block syntax highlighting
- Supports gist embedding (use `<gist>` tags, i.e. `<gist>file.sh</gist>`) - [Example](https://eyecatchup.github.io/nicegist/?id=3382937)

## Under the hood

- [GitHub Gist API](https://developer.github.com/v3/gists/#get-a-single-gist) for fetching gists
- [Chromium destilled webpage layout](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/components/dom_distiller/) for optimized reading experience
- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing
- [highlight.js](https://highlightjs.org/) for code block syntax highlighting
- Some regex sugar and a hidden gist feature for gist embedding

## License

(c) 2019, Stephan Schmitz <eyecatchup@gmail.com>  
License: MIT, <http://eyecatchup.mit-license.org>  
URL: <https://eyecatchup.github.io/nicegist>  
