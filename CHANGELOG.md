# Changelog

All notable changes to the Kill Bull extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-05-31

### Added
- User preferences for configurable elimination modes
- Extended bullet point support (•, -, *, +, ‣, ◦, ▪, ▫, ⁃)
- Numbered list elimination (1. 2. 3., 1) 2) 3), (1) (2) (3))
- Letter list elimination (a. b. c., A. B. C., (a) (b) (c))
- Rich text compatibility with PowerPoint and Word
- Smart preservation of markdown blockquotes and code blocks
- Optimized regex patterns for better performance
- Comprehensive error handling and user feedback

### Enhanced
- Improved text structure preservation
- Better handling of mixed content (rich text + plain text)
- More efficient bullet point detection
- Smarter exclusion patterns for markdown elements

## [1.0.0] - 2024-05-31

### Added
- Initial release of Kill Bull extension
- Remove bullet points and indentation from selected text or clipboard content
- Support for multiple bullet point types (-, *, •, +)
- Handle various indentation types (spaces, tabs)
- Preserve markdown headers while cleaning text
- Automatic detection of selected text vs clipboard content
- Direct text replacement when text is selected
- Fallback to clipboard processing when no text is selected
- Clean bullet points from start of lines only
- Maintain markdown header formatting (#, ##, ###, etc.)
- Smart text source detection (selected text priority over clipboard)
- Seamless integration with macOS text editing workflows
