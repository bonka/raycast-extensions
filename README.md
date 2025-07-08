# Kill Bull

Remove bullet points and markdown elements from the beginning of lines in clipboard text or selected text.

## Overview

Kill Bull's **default behavior** is to slash list items such as bullet points, sequential numbers, and letters. However, it's also capable of targeting structural markdown elements such as headers, blockquotes, code blocks, horizontal rules, and indentation.

The default behavior can be customized in two ways:
1. **Settings menu** - Configure persistent preferences for what elements to target
2. **Command arguments** - Use inline commands like `kill bull a` for one-time targeting modes

### Targeting Modes
- **Full Assault** - Wider targeting that hits multiple element types simultaneously
- **Silent Strike** - Precise targeting of specific structural markdown elements only

## Features

- **Smart text detection**: Automatically processes selected text or falls back to clipboard content.
- **Default behavior**: Removes all bullet points and list markers
- **Multiple bullet types**: Supports `•`, `-`, `*`, `+`, `‣`, `◦`, `▪`, `▫`, `⁃` bullet points
- **List markers**: Removes all variations of numbered and lettered lists (1., 1), (1), A., A), (A), a., a), (a))
- **Cross-platform text**: Normalizes line endings from different operating systems
- **Direct replacement**: When text is selected, it gets replaced immediately
- **Clipboard processing**: When no text is selected, processes clipboard content

## Quick Mode Arguments

Kill Bull accepts quick mode arguments with fuzzy matching - just type the first letter(s) of the mode:

**Note**: Kill Bull only removes structural block elements, not inline markdown formatting, like `**bold**` or `[links](url)`.

### Full Assault (Multiple targets)
- `a` / `all` - Destroys all structural block elements
- `l` / `lists` - Targets all list elements (bullets, numbers, letters)
- `s` / `structure` - Targets all structural elements (headers, quotes, code, rules)

### Silent Strike (Individual targeting)
- `h` / `headers` - Only headers (#, ##, ###)
- `q` / `quotes` - Only blockquotes (>)
- `c` / `code` - Only code blocks (```)
- `r` / `rules` - Only horizontal rules (---, ***)
- `i` / `indent` - Only indentation

Just type `kill bull a` or `kill bull all` - both work! Fuzzy matching means `h`, `he`, `headers` all work for headers mode.

**Default behavior can be customized in the extension settings** to target a wider or more narrow range of elements, without using mode arguments.

## Usage

1. **With selected text**: Select text containing bullet points → Run Kill Bull → Text is instantly replaced with cleaned version
2. **With clipboard**: Copy text with bullet points → Run Kill Bull → Cleaned text replaces clipboard content

### Before (default behavior)
    • First bullet point 
        * Nested bullet
    1. Numbered list

### After
    First bullet point
        Nested bullet
    Numbered list
        

## Opt-out Features

By default, Kill Bull removes all bullet points and list markers both numeric and alphabetical. You can customize this behavior in Raycast preferences. Check these preferences to "ON" to have mercy on:

- Spare **Bullet**: Keep bullet characters (•, -, *, +)
- Spare **Numbers**: Keep numbered list markers (1., 1), (1), A., A), (A))
- Spare **Letters**: Keep letter list markers (a., a), (a))

## Opt-in Features

By default, Kill Bull only targets bullet points and list markers, but additional noisy markdown elements can be removed by opting in enabling these preferences:

- Kill **Headers**: Remove markdown headers (#, ##, ###)
- Kill **Quotes**: Remove markdown blockquotes (>)
- Kill **Code**: Remove code blocks (```, `)
- Kill **Rules**: Remove horizontal rules (---, ***)

When a checkbox is checked, the corresponding element will be removed. When unchecked, the element will be preserved.

## Perfect for

- Converting bullet lists to plain text
- Cleaning up copied content from chatbots, webpages
- Removing formatting while preserving structure
- Preparing text for documentation


---

*Kill Bull — The silent warrior’s path to spotless content..* 🗡️