# Changelog

All notable changes to the Kill Bull extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-01-08

### Added
- **Command arguments support** - Use inline commands like `kill bull a` for one-time targeting
- **Full Assault modes** - Wide-area targeting: `all`, `lists`, `structure`
- **Silent Strike modes** - Precise targeting: `headers`, `quotes`, `code`, `rules`, `indent`
- **Fuzzy matching** - Type partial words: `h`, `hea`, `headers` all work
- **Enhanced toast messages** - Clear feedback with samurai-themed notifications
- **Comprehensive README** - Added overview, targeting modes, and usage examples

### Changed
- **Renamed "markdown" mode to "structure"** - More accurate description of what it targets
- **Removed "basic" mode** - Simplified to just "lists" for clarity
- **Improved default toast messages** - Now shows "X targets eliminated" with samurai flair
- **Updated settings descriptions** - Removed confusing "Silent Strike" label from settings
- **Enhanced placeholder text** - Shorter, clearer examples in command input

### Fixed
- **Critical regex bugs** - Fixed numbered lists pattern `/^\s*\(\d+\)\s/` and letter lists `/^\s*\([a-zA-Z]\)\s/`
- **Preference key mapping** - Fixed `quotes` → `killQuotes` mapping issue
- **Indentation handling** - Consolidated and optimized indentation removal logic
- **Toast message redundancy** - Removed duplicate words and colons in preset modes

### Removed
- **Misleading rich text claims** - Corrected documentation to accurately reflect capabilities
- **"Smart Rich Text Detection" section** - Removed false advertising from README

## [1.1.0] - 2025-06-01

### Added
- User preferences for configurable opting in and out of elimination modes
- Opt in: Elimination of markdown headers, blockquotes, code, horizontal rules, and indentation
- Opt out: Preservation of bullet points, numbers, and letters
- Extended bullet point support (•, -, *, +, ‣, ◦, ▪, ▫, ⁃)
- Selective elimination of numbered and letter list styles  1. 2. 3., 1) 2) 3),  (1) (2) (3)
- Selective elimination of letter list styles (a. b. c., A. B. C., (a) (b) (c))

### Fixed
- Optimized regex patterns for better performance
- Improved indentation handling
- Fixed markdown rule pattern

### Enhanced
- Better handling of mixed content (rich text + plain text)
- More efficient bullet point detection
- Smarter exclusion patterns for markdown elements

## [1.0.0] - 2024-05-31

### Initial commit
- Initial release of Kill Bull extension
- Remove bullet points and indentation from selected text or clipboard content
- Support for multiple bullet point types (-, *, •, +)
- Handle various indentation types (spaces, tabs)
- Automatic detection of selected text vs clipboard content
- Direct text replacement when text is selected
- Fallback to clipboard processing when no text is selected
- Maintain markdown header formatting (#, ##, ###, etc.)
- Basic markdown element exclusion support
