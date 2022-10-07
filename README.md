# postcards-html

A web component for displaying Postcards in the `.postcard` file format in HTML.

## Usage

```html
<script type="module" src="https://unpkg.com/@dotpostcard/postcards-html?module"></script>
<p>Hello from Madrid:</p>
<postcard-display src="./hello.postcard"></postcard-display>
```

⚠️ Please note: Make sure the `.postcard` file you're sourcing isn't inaccessible due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

You can download a [sample `.postcard` file here](https://github.com/dotpostcard/postcards-go/blob/main/fixtures/hello.postcard?raw=true).
