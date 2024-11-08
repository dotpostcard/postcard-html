# Archival

My plans for the .postcard format changed significantly in ealry 2024; please visit [jphastings/dotpostcard](https://github.com/jphastings/dotpostcard) to learn about the significantly simpler tool & ecosystem I switched to building!

# postcards-html

Web components for displaying Postcards in the `.postcard` file format in HTML.

## Usage

_See this example at [dotpostcard.github.io/postcards-html](https://dotpostcard.github.io/postcards-html/)._

```html
<script type="module" src="https://unpkg.com/@dotpostcard/postcards-html?module"></script>
<p>Hello from Madrid:</p>
<postcard-display name="hello" src="https://raw.githubusercontent.com/dotpostcard/postcards-go/main/fixtures/hello.postcard"></postcard-display>

<postcard-info for="hello"></postcard-info>
```

### Events

Two `CustomEvent`s are dispatched from a `postcard-display` element during its lifetime. The `postcard-info` element hooks into them automatically, but you can attach directly if you'd like more control over what data is displayed.

`postcard-loaded`: fired once the metadata has loaded, the `detail` property contains the `name` of the postcard display element, `metadata` which is a `Metadata` object (as specified by `postcards-ts`), and the `showingSide` (which is either `front` or `back`, and can be used to get metadata for the currently showing side of the postcard with `metadata[showingSide]`).

`postcard-flipped`: fired each time the postcard is flipped over. The `detail` property contains the `name` and `showingSide` keys, as described above.
