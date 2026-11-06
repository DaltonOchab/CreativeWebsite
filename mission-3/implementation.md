# Golf Ball Locator · Mission 3

The hero's illustrated SVG ball was replaced with **The lost ball, found.**, the golf course model confirmed in Mission 2. Its 35 meshes include the phone, textured screen, locator ball and ping rings. The course uses the confirmed isometric viewing direction and daylight lighting, with a transparent canvas over the site's original fairway artwork.

Visitors can drag or swipe to rotate, pinch or use the zoom buttons, and reset the view. Keyboard users can focus the model and use the left and right arrows. Scrolling over the model with a mouse wheel advances the original scroll story. The viewer renders on demand and respects reduced motion. A device that cannot run WebGL displays the confirmed preview with a static-preview label.

The imported GLB is 526,372 bytes. Its SHA-256 is `46450956e0b851976657e19152dc4213f05828fbe410b406b9200be5c5e35b2d`, matching the version 1.0.0 handoff manifest. The model depicts a concept and the locator demo simulates a search. The verification used Chrome and an emulated touch viewport.

The existing GitHub Pages workflow serves the site at [Golf Ball Locator](https://daltonochab.github.io/CreativeWebsite/). The original website is recoverable at commit `0b9d102` on branch `backup/pre-mission-3`. The production browser checks cover the model checksum, lighting and framing, rotation, touch gestures, zoom/reset, reduced motion, WebGL fallback, navigation, starter-pack pricing, sample ping, distance control, pilot-market selector and FAQ. See [desktop screenshot](desktop.png) and [mobile screenshot](mobile.png).

To revise the course, open [Venture 3D Studio](https://daltonochab.github.io/Venture-3D-Studio/) and use **Open project** to load the handoff's project.json. Edit components, select **Confirm model**, download the new confirmed ZIP into ROOT WORKSPACE, and run Mission 3 again.
