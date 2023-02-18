# ⭐ Lethargy-TS

`lethargy-ts` is a modern rewrite of `lethargy` – a popular JavaScript library to help distinguish between scroll events initiated by the user, and those by inertial scrolling.

[![npm (scoped)](https://img.shields.io/npm/v/lethargy-ts?style=flat-square)](https://www.npmjs.com/package/lethargy-ts)
[![Bundle Size](https://img.shields.io/bundlephobia/min/lethargy-ts?style=flat-square)](https://bundlephobia.com/result?p=lethargy-ts)
![type definition](https://img.shields.io/npm/types/lethargy-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/snelsi/lethargy-ts/blob/master/LICENSE)

🌳 Tiny and Easy to use

🦄 Written in TypeScript

🎏 Highly Customizable

🏖 No external dependencies

## Install

```ssh
yarn add lethargy-ts
```

or

```ssh
npm install --save lethargy-ts
```

## Usage

Import and create an instance of `Lethargy`. It will remember previously checked `wheelEvents` to help to determine if they are inertial or not:

```tsx
import { Lethargy } from "lethargy-ts";

const lethargy = new Lethargy();
```

You can customize parameters to better match your application's needs:

```tsx
const lethargy = new Lethargy({
  sensitivity: 20,
  delay: 100,
  inertiaDecay: 10,
});
```

> 😉 If you found optimizations for the defaults, please share them in this [ticket](https://github.com/d4nyll/lethargy/issues/2)!

Bind the wheel event and pass the event to `Lethargy`:

```tsx
const checkWheelEvent = (e: WheelEvent) => {
  const isIntentional = lethargy.check(e);

  if (isIntentional) {
    // Do something with the scroll event
  }
};

window.addEventListener("wheel", checkWheelEvent, { passive: true });
```

`lethargy.check(e)` will return `true` if it's a normal wheel event initiated by the user, and `false` if it's initiated by inertial scrolling.

`Lethargy` focus on preventing false positives (saying it's a normal scroll event when it wasn't), but tolerates false negatives (saying it's not a normal scroll event when it is).

## Options

All options are optional:

- `sensitivity` - Specifies the minimum value for `wheelDelta` for it to register as a valid scroll event. Because the tail of the curve has low `wheelDelta` values, this will stop them from registering as valid scroll events.

- `delay` - Threshold for the amount of time between mouse wheel events for them to be deemed separate.

- `inertiaDecay` - Inertia event may be no more than this percents smaller that previous event.

## What problem does it solve?

Scroll plugins such as [smartscroll](https://github.com/d4nyll/smartscroll), [jquery-mousewheel](https://github.com/jquery/jquery-mousewheel), or [fullPage.js](http://alvarotrigo.com/fullPage/) work by detecting scroll events and then doing something with them, such as scroll to the next frame. However, inertial scrolling continues to emit scroll events even after the user stopped, and this can often lead to problems, such as scrolling two to three frames when the user only scrolled once.

## How does it work?

Lethargy keeps a record of the last few `wheelDelta` values that are passed through it, it will then work out whether these values are decreasing (decaying), and if so, concludes that the scroll event originated from inertial scrolling, and not directly from the user.

## Limitations

Not all trackpads work the same, some trackpads do not have a decaying `wheelDelta` value, so our method of decay detection would not work. Instead, to cater to this situation, we had to, grudgingly, set a very small time delay between when events will register. We have tested this and normal use does not affect user experience more than usual.

## TypeScript

The module is written in TypeScript and type definitions are included.

## Contributing

Contributions, issues, and feature requests are welcome!

## Show your support

Give a ⭐️ if you like this project!

## LICENSE

[MIT](./LICENSE)
