# Kill Bull

Remove bullet points and indentation from the beginning of lines in clipboard text or selected text.

## Features

- **Smart text detection**: Automatically processes selected text or falls back to clipboard content
- **Multiple bullet types**: Supports `•`, `-`, `*`, `+`, `‣`, `◦`, `▪`, `▫`, `⁃` bullet points
- **Rich text handling**: Detects and normalizes rich text from PowerPoint, Word, and other applications
- **Markdown preservation**: Keeps markdown headers (`#`, `##`, `###`) intact
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
    # This header stays
    • Last bullet point

### After
    First bullet point
    Second bullet point
    Nested bullet
    Another type
    # This header stays
    Last bullet point

## Configuration

Kill Bull offers three elimination modes that can be configured in Raycast preferences:

- **Eliminate Bullet Points** (default: ON): Remove bullet characters (•, -, *, +)
- **Assassinate Numbered Lists** (default: OFF): Remove numbered list markers (1. 2. 3.)
- **Terminate Letter Lists** (default: OFF): Remove letter list markers (a. b. c.)

## Smart Rich Text Detection

Kill Bull automatically detects rich text from applications like PowerPoint and Word, which often include extra newlines and spacing. The extension normalizes this formatting before processing to prevent unwanted line breaks in the output.

## Perfect for

- Cleaning up copied content from presentations
- Converting bullet lists to plain text
- Preparing text for documentation
- Removing formatting while preserving structure

---

*Kill Bull - Because sometimes you need to eliminate the bullets to get content.* 🗡️