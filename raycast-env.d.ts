/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Show symbolic mercy on these markers - Show mercy on the humble bullet points (•, -, *). */
  "spareBullets": boolean,
  /**  - Grant passage to the numeric order (1. 2. 3.) */
  "spareNumbers": boolean,
  /**  - Grant clemency to alphabetic procession (a, b, c) */
  "spareLetters": boolean,
  /** Widen the textual obliteration - Slice the heads of markdown (#, ##, ###) with extreme prejudice. */
  "killHeaders": boolean,
  /**  - Target snarky blockquotes (>) for termination. */
  "killQuotes": boolean,
  /**  - Obliterate oppressive text dungeon (```) code blocks. */
  "killCode": boolean,
  /**  - Chop horizontal rules (---, ***) into pieces. */
  "killRules": boolean,
  /**  - Destroy hierarchical tabulation. */
  "killIndentation": boolean
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `kill-bull` command */
  export type KillBull = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `kill-bull` command */
  export type KillBull = {}
}

