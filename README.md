# Kill Bull

Remove bullet points and markdown elements from the beginning of lines in clipboard text or selected text.

## Features

- **Smart text detection**: Automatically processes selected text or falls back to clipboard content
- **Default behavior**: Removes all bullet points and list markers
- **Multiple bullet types**: Supports `•`, `-`, `*`, `+`, `‣`, `◦`, `▪`, `▫`, `⁃` bullet points
- **List markers**: Removes all variations of numbered and lettered lists (1., 1), (1), A., A), (A), a., a), (a))
- **Rich text handling**: Detects and normalizes rich text from PowerPoint, Word, and other applications
- **Direct replacement**: When text is selected, it gets replaced immediately
- **Clipboard processing**: When no text is selected, processes clipboard content

## Usage

1. **With selected text**: Select text containing bullet points → Run Kill Bull → Text is instantly replaced with cleaned version
2. **With clipboard**: Copy text with bullet points → Run Kill Bull → Cleaned text replaces clipboard content

### Before
    • First bullet point
    - Second bullet point  
        * Nested bullet
    + Another type
    1. Numbered list
    a. Letter list

### After
    First bullet point
    Second bullet point
        Nested bullet
    Another type
    Single line code
    Multi-line code
    This header stays
    Blockquote


## Configuration

By default, Kill Bull removes all bullet points and list markers. You can customize this behavior in Raycast preferences:

- **Spare Bullet Points** (default: OFF): Keep bullet characters (•, -, *, +)
- **Spare Numbers** (default: OFF): Keep numbered list markers (1., 1), (1), A., A), (A))
- **Spare Letters** (default: OFF): Keep letter list markers (a., a), (a))
- **Kill Indentation** (default: OFF): Destroy hierarchical tabulation

## Opt-in Features

Additional markdown elements can be removed by enabling these preferences:

- **Kill Headers** (default: OFF): Remove markdown headers (#, ##, ###)
- **Kill Blockquotes** (default: OFF): Remove markdown blockquotes (>)
- **Kill Code** (default: OFF): Remove code blocks (```, `)
- **Kill Rules** (default: OFF): Remove horizontal rules (---, ***)

When a checkbox is checked, the corresponding element will be removed. When unchecked, the element will be preserved.

## Smart Rich Text Detection

Kill Bull automatically detects rich text from applications like PowerPoint and Word, which often include extra newlines and spacing. The extension normalizes this formatting before processing to prevent unwanted line breaks in the output.

## Perfect for

- Cleaning up copied content from presentations
- Converting bullet lists to plain text
- Preparing text for documentation
- Removing formatting while preserving structure

---

*Kill Bull - Because sometimes you need to eliminate the bullets to get content.* 🗡️