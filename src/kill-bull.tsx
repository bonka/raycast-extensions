import { Clipboard, showToast, Toast, closeMainWindow, getSelectedText, getPreferenceValues } from "@raycast/api";

// Bullet point characters to eliminate
const BULLET_CHARS = '•\\-*+‣◦▪▫⁃'; // All bullet characters (hyphen escaped for regex)

// Single regex pattern to match any bullet point at start of line
// Groups: leading whitespace, bullet char, space after bullet, content
const BULLET_PATTERN = new RegExp(`^(\\s*)([${BULLET_CHARS}])(\\s+)(.*)$`);

// Number list patterns to eliminate
const NUMBER_PATTERNS = [
  /^\s*\d+[\.\)]\s/,       // 1. 2. 1) 2) etc.
  /^\s*\(\d+\)\s/,         // (1) (2) (3) etc.
];

// Letter list patterns to eliminate
const LETTER_PATTERNS = [
  /^\s*[a-zA-Z][\.\)]\s/,  // a. A. a) A) etc.
  /^\s*\([a-zA-Z]\)\s/,    // (a) (A) (b) (B) etc.
];

// Patterns to match markdown elements
type ExclusionPattern = {
  [key: string]: RegExp;
};

const EXCLUSIONS: ExclusionPattern = {
  headers: /^\s*#{1,6}\s/,          // Markdown headers (# ## ###)
  quotes: /^\s*>{1,3}\s/,          // Markdown blockquotes (> >> >>>)
  code: /^\s*`(\S.*)$/,            // Single backtick followed by non-space character
  codeBlock: /^\s*```/,             // Fenced code blocks (```)
  rules: /^\s*[\-*]+\s*$/,       // Horizontal rules (--- or ***)
};

interface Preferences {
  spareBullets: boolean;
  spareNumbers: boolean;
  spareLetters: boolean;
  killHeaders: boolean;
  killQuotes: boolean;
  killCode: boolean;
  killRules: boolean;
}

export default async function Command() {
  try {
    await closeMainWindow();
    
    const preferences = getPreferenceValues<Preferences>();
    
    let sourceText = "";
    let hasSelectedText = false;
    
    try {
      sourceText = await getSelectedText();
      hasSelectedText = true;
    } catch {
      sourceText = await Clipboard.readText() || "";
      hasSelectedText = false;
    }
    
    if (!sourceText.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No text found"
      });
      return;
    }

    // Normalize line endings but preserve structure
    const normalizedText = sourceText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');
    
    let killed = 0;
    const killedTypes: string[] = [];
    
    // Process each line
    const cleanedText = normalizedText
      .split('\n')
      .map((line, index, array) => {
        // Handle code blocks specially
        if (preferences.killCode) {
          // Check for single-line code block (backtick followed by letter)
          if (EXCLUSIONS.code.test(line)) {
            // Remove the backtick but keep everything after it
            killed++;
            if (!killedTypes.includes('code')) killedTypes.push('code');
            return line.replace(EXCLUSIONS.code, '$1');
          }
          // Check for multi-line code block (three backticks)
          if (EXCLUSIONS.codeBlock.test(line)) {
            // Find the closing fence
            const closingIndex = array.findIndex((l, i) => 
              i > index && l.trim() === '```'
            );
            if (closingIndex !== -1) {
              // Mark this line and the closing line for removal
              killed += 2;
              if (!killedTypes.includes('code')) killedTypes.push('code');
              // Return empty string for this line (opening fence)
              return '';
            }
          }
          // If we're past the opening fence and before the closing fence, keep the line
          const openingIndex = array.findIndex(l => EXCLUSIONS.codeBlock.test(l));
          const closingIndex = array.findIndex((l, i) => 
            i > openingIndex && l.trim() === '```'
          );
          if (openingIndex !== -1 && closingIndex !== -1 && 
              index > openingIndex && index < closingIndex) {
            return line;
          }
          // If we're at the closing fence, remove it
          if (index === closingIndex) {
            return '';
          }
        }
        
        // First handle bullet points, numbers, and letters (if their checkboxes are unchecked)
        if (!preferences.spareBullets && BULLET_PATTERN.test(line)) {
          killed++;
          if (!killedTypes.includes('bullets')) killedTypes.push('bullets');
          return line.replace(BULLET_PATTERN, '$4'); // Return only content
        }
        
        // Check for numbers if enabled
        if (!preferences.spareNumbers) {
          for (const pattern of NUMBER_PATTERNS) {
            if (pattern.test(line)) {
              killed++;
              if (!killedTypes.includes('numbers')) killedTypes.push('numbers');
              return line.replace(pattern, '').trim();
            }
          }
        }
        
        // Check for letters if enabled
        if (!preferences.spareLetters) {
          for (const pattern of LETTER_PATTERNS) {
            if (pattern.test(line)) {
              killed++;
              if (!killedTypes.includes('letters')) killedTypes.push('letters');
              return line.replace(pattern, '').trim();
            }
          }
        }

        // Then handle other markdown elements (if their checkboxes are checked)
        for (const [key, pattern] of Object.entries(EXCLUSIONS)) {
          if (pattern.test(line)) {
            const kill = preferences[`kill${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof Preferences];
            if (kill) {
              killed++;
              if (!killedTypes.includes(key)) killedTypes.push(key);
              // Handle inline code specially
              if (key === 'inlineCode') {
                // Remove the backticks but keep the content
                return line.replace(pattern, (match, p1) => p1.trim());
              }
              // Remove only the beginning of line characters for other elements
              return line.replace(pattern, '').trimStart();
            }
          }
        }

        // Keep everything else unchanged (preserves empty lines and spacing)
        return line;
      })
      .join('\n'); // Preserve all line breaks
    
    // Output
    if (hasSelectedText) {
      await Clipboard.paste(cleanedText);
    } else {
      await Clipboard.copy(cleanedText);
    }
    
    const message = killed > 0 
      ? `${killed} items killed: ${killedTypes.join(', ')}`
      : "No matching patterns found";
    
    await showToast({
      style: Toast.Style.Success,
      title: hasSelectedText ? "Text cleaned" : "Clipboard cleaned",
      message: message
    });
    
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: String(error)
    });
  }
}
