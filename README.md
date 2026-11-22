# Pet Paws

Games for children aged 5 to 8. The front page offers two games, and a switcher lets children move between them. Choose a puppy, kitten, bunny, hamster or pony, then feed, groom, walk, play with and teach your pet. Earn stars and spend them in the sticker book.

**World Kitchen** (`kitchen.js` and `kitchen.css`) is a bolt-on where children cook 8 dishes from around the world, step by step, or invent their own. It plugs into the main game through `SCREENS`, `ENTER` and `LEAVE` in `index.html`.

**Monster Cookies** (`cookies.js` and `cookies.css`) is a third game: bake cookies, then feed them to three hungry monsters. Feeding hot cookies burns their mouths and fingers, and raw dough sticks in their teeth. It reuses some styles from `kitchen.css`.

There is no build step. Progress is saved in each device's browser.

Play it on a phone: open the GitHub Pages address, then use **Add to Home Screen**.

When you change `kitchen.js` or `kitchen.css`, bump the `?v=` number where `index.html` loads them, so phones don't mix a new page with an old cached file.
