# GSAP (self-hosted)

These are byte-for-byte copies of the minified GreenSock Animation Platform
libraries, pinned to **version 3.12.5** and pulled from the cdnjs CDN.

- `gsap.min.js` (72,214 bytes) — GSAP core
- `ScrollTrigger.min.js` (43,380 bytes) — ScrollTrigger plugin

## Source

- https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
- https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js

## Why self-hosted

The home page loads these locally instead of from the CDN. This removes a
third-party request from the critical path and keeps the versions fixed so the
page never changes under us when a newer build ships. They are loaded in
`index.html` in this order (gsap before ScrollTrigger, which must come first):

```html
<script src="vendor/gsap/gsap.min.js"></script>
<script src="vendor/gsap/ScrollTrigger.min.js"></script>
```

If you ever need to upgrade, fetch the same pinned version from cdnjs and
replace both files — do not mix versions, and keep gsap ahead of ScrollTrigger.