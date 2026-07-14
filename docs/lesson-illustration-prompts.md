# Lesson Illustration Prompts

Image-generation prompts for replacing/supplementing the emoji visuals on each
unit's Learn screen with richly detailed, custom illustrations. Written for a
5-year-old audience: warm, uncomplicated, no text in the image (pre-readers),
one clear subject per image.

Use with any image generator (Midjourney, DALL-E, Stable Diffusion, etc.).
Prepend the **Master Style Prefix** to every per-unit prompt below, or bake it
into a system/style prompt if your tool supports one.

---

## Master Style Prefix

> Children's educational illustration for a 5-year-old, warm and cheerful
> cartoon style, thick clean rounded outlines, soft gentle shading, bright
> saturated but not garish colors, a single clear subject centered in the
> frame, simple uncluttered pastel background with no distracting detail, no
> text or letters or numbers rendered as writing anywhere in the image,
> friendly rounded character design if any characters appear, inviting and
> calm mood, similar in spirit to Sago Mini or Toca Boca app art, square
> 1:1 composition.

---

## Unit 1 -- Numbers to 10

> Ten shiny red apples with green leaves and stems lined up in a single row on
> a rustic wooden table, each apple slightly different in size and tilt to
> feel playful and hand-drawn, warm morning sunlight, soft orchard background
> blurred behind the table.

## Unit 2 -- Working with numbers to 10 (add & subtract)

> A cheerful cartoon squirrel with an oversized fluffy tail, standing between
> two small piles of acorns, sweeping a few acorns from one pile toward the
> other with its paw, a big soft plus symbol and a big soft minus symbol
> floating like clouds above the two piles, bright forest clearing background.

## Unit 3 -- Geometry (2D shapes)

> Five friendly shape characters with cute round eyes and rosy cheeks standing
> in a row holding hands: a triangle, a square, a pentagon, a hexagon, and an
> octagon shaped like a classic red stop sign, each shape a different bright
> primary or pastel color, standing on soft green grass under a blue sky.

## Unit 4 -- Fractions (half)

> A round chocolate-frosted cake with pink sprinkles, cut cleanly down the
> middle into two equal halves, one half sitting slightly apart from the other
> on a cheerful polka-dot plate, warm kitchen-table background.

## Unit 5 -- Measures (length)

> Two caterpillars side by side on a leaf, one short and one long, with a
> soft yellow measuring tape laid gently along the ground beneath them curling
> playfully, bright garden background with a few daisies.

## Unit 6 -- Position (ordinal numbers)

> A cheerful lineup of five different woodland animals (rabbit, fox, owl,
> hedgehog, mouse) standing one behind another on a race-start line, each
> wearing a colorful ribbon medal of a different color, a checkered finish
> flag waving gently in the background, sunny meadow.

## Unit 7 -- Time (o'clock)

> A large friendly analog clock character with a round smiling face where the
> clock face would be, short chubby hour hand and long thin minute hand drawn
> as soft rounded arms, the short arm pointing at the number 3, sitting on a
> cozy shelf with a small potted plant beside it, warm cottage interior
> background.

## Unit 8 -- Statistics (sets & grouping)

> Two large overlapping soft-edged circles like bubbles, one pale blue and one
> pale yellow, with the overlapping middle area a soft green, each circle
> filled with a few simple cartoon fruit stickers (apples in blue, bananas in
> yellow, one apple-banana hybrid sticker sitting in the shared green middle),
> plain cream background.

## Unit 9 -- Numbers to 20

> Twenty small round colorful balloons in two neat clusters of ten floating
> gently upward against a soft twilight sky, each balloon a slightly different
> pastel color, a few tiny stars twinkling in the background.

## Unit 10 -- Working with numbers to 20 (add & subtract)

> A friendly bear cub stacking small wooden blocks into two towers side by
> side, one hand adding a block to the taller tower and the other hand gently
> removing a block from the shorter tower, big soft plus and minus clouds
> floating above each tower, cozy nursery background.

## Unit 11 -- Geometry (2) (3D shapes)

> A cheerful assortment of chunky 3D toy shapes scattered on a rug: a fat
> orange cube, a blue cylinder like a small drum, a green cone like a party
> hat, and a striped soccer ball made of hexagon and pentagon patches, soft
> warm playroom background with a few scattered building blocks.

## Unit 12 -- Fractions (2) (half of bigger numbers)

> A large round pizza with colorful pepperoni and vegetable toppings, cut
> cleanly into two equal halves with one half lifted slightly on a spatula,
> warm cozy kitchen background with a checkered tablecloth.

## Unit 13 -- Measures (2) (weight & capacity)

> A charming old-fashioned balance scale with a fluffy orange cat sitting on
> one side and three plump pumpkins on the other, perfectly balanced, next to
> it a tall clear glass pitcher of orange juice pouring into a smaller cup,
> sunny kitchen-window background.

## Unit 14 -- Position, direction and patterns

> A winding garden path made of colorful stepping stones in a repeating
> pattern of red, yellow, red, yellow stones, a cheerful cartoon rabbit
> mid-hop following the pattern with a curious expression, lush green garden
> background with butterflies.

## Unit 15 -- Time (2) (half past)

> The same friendly round clock character as Unit 7, now with its short arm
> resting between the 3 and the 4 and its long arm pointing straight down at
> the 6, a small soft cloud above its head shaped like "half", cozy bedroom
> nightstand background with a warm lamp glow.

## Unit 16 -- Statistics (2) (graphs & tally)

> A cheerful bar-graph scene reimagined as a row of stacked colorful building
> blocks of different heights (like a tiny skyline), a friendly ladybug
> sitting on top of the tallest stack pointing down at it with one leg,
> bright playroom-floor background.

---

## Notes for use

- Generate at a square aspect ratio to match the existing `lesson-screen__emoji`
  slot (swap the `emoji` string for an `imageUrl` field when these are ready --
  see "Next step" below).
- Keep every image a **single clear subject** -- avoid busy multi-panel scenes,
  since the audience is 5 years old and the image needs to be understood in
  under 2 seconds.
- If an image generator's output includes any stray text/numbers rendered as
  writing, regenerate -- text in the image can't be read aloud and looks like
  a mistake to a pre-reader.

**Next step (when you have the generated images):** add an `imageUrl?: string`
field alongside `emoji` on `LessonSlide`, save the images under
`src/assets/lessons/`, and prefer `imageUrl` over `emoji` in `LessonScreen`
when both are present -- so slides can be upgraded one at a time without a
breaking change.
