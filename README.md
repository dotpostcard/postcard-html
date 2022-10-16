# postcards-html

Web components for displaying Postcards in the `.postcard` file format in HTML.

## Usage

```html
<script type="module" src="https://unpkg.com/@dotpostcard/postcards-html?module"></script>
<p>Hello from Madrid:</p>
<postcard-display name="hello" src="./hello.postcard"></postcard-display>

<postcard-info for="hello"></postcard-info>
```

⚠️ Please note: Make sure the `.postcard` file you're sourcing isn't inaccessible due to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

You can download a [sample `.postcard` file here](https://github.com/dotpostcard/postcards-go/blob/main/fixtures/hello.postcard?raw=true).

### Events

Two `CustomEvent`s are dispatched from a `postcard-display` element during its lifetime. The `postcard-info` element hooks into them automatically, but you can attach directly if you'd like more control over what data is displayed.

`postcard-loaded`: fired once the metadata has loaded, the `detail` property contains the `name` of the postcard display element, `metadata` which is a `Metadata` object (as specified by `postcards-ts`), and the `showingSide` (which is either `front` or `back`, and can be used to get metadata for the currently showing side of the postcard with `metadata[showingSide]`).

`postcard-flipped`: fired each time the postcard is flipped over. The `detail` property contains the `name` and `showingSide` keys, as described above.
