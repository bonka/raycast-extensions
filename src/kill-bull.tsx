import {
  Clipboard,
  showToast,
  Toast,
  closeMainWindow,
  getSelectedText,
  getPreferenceValues,
  LaunchProps,
} from "@raycast/api";

// Bullet point characters to eliminate
const BULLET_CHARS = "•\\-*+‣◦▪▫⁃"; // All bullet characters (hyphen escaped for regex)

// Single regex pattern to match any bullet point at start of line
// Groups: leading whitespace, bullet char, space after bullet, content
const BULLET_PATTERN = new RegExp(`^(\\s*)([${BULLET_CHARS}])(\\s+)(.*)$`);

// Patterns to match markdown elements
type ExclusionPattern = {
  [key: string]: RegExp;
};

const EXCLUSIONS: ExclusionPattern = {
  headers: /^\s*#{1,6}\s/, // Markdown headers (# ## ###)
  quotes: /^\s*>{1,3}\s/, // Markdown blockquotes (> >> >>>)
  code: /^\s*`(\S.*)$/, // Single backtick followed by non-space character
  codeBlock: /^\s*```/, // Fenced code blocks (```)
  rules: /^\s*[-*]+\s*$/, // Horizontal rules (--- or ***)
};

interface Preferences {
  spareBullets: boolean;
  spareNumbers: boolean;
  spareLetters: boolean;
  killHeaders: boolean;
  killQuotes: boolean;
  killCode: boolean;
  killRules: boolean;
  killIndentation: boolean;
}

interface Arguments {
  mode?: string;
}

interface ModeInfo {
  modeName: string;
  description: string;
}

// Parse mode argument and apply preset or specific overrides
function parseMode(mode: string, basePreferences: Preferences): { preferences: Preferences; modeInfo: ModeInfo } {
  const preferences = { ...basePreferences };
  let modeInfo: ModeInfo = { modeName: "Custom", description: "Using preferences" };

  if (!mode?.trim()) {
    return { preferences, modeInfo };
  }

  const input = mode.trim().toLowerCase();

  // Preset modes
  if (matchesAny(input, ["a", "all"])) {
    // Kill everything
    preferences.spareBullets = false;
    preferences.spareNumbers = false;
    preferences.spareLetters = false;
    preferences.killHeaders = true;
    preferences.killQuotes = true;
    preferences.killCode = true;
    preferences.killRules = true;
    preferences.killIndentation = true;
    modeInfo = { modeName: "All", description: "items destroyed" };
  } else if (matchesAny(input, ["s", "st", "str", "stru", "struc", "struct", "structu", "structur", "structure"])) {
    // All structural elements, spare lists
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = true;
    preferences.killQuotes = true;
    preferences.killCode = true;
    preferences.killRules = true;
    preferences.killIndentation = true;
    modeInfo = { modeName: "Structure", description: "structural elements destroyed" };
  } else if (matchesAny(input, ["l", "li", "lis", "list", "lists"])) {
    // Only lists (bullets, numbers, letters)
    preferences.spareBullets = false;
    preferences.spareNumbers = false;
    preferences.spareLetters = false;
    preferences.killHeaders = false;
    preferences.killQuotes = false;
    preferences.killCode = false;
    preferences.killRules = false;
    preferences.killIndentation = false;
    modeInfo = { modeName: "Lists", description: "list elements eliminated" };
  }
  // Silent assassination modes (ONLY target specific elements)
  else if (matchesAny(input, ["h", "he", "hea", "head", "heade", "header", "headers"])) {
    // Spare everything except headers
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = true;
    preferences.killQuotes = false;
    preferences.killCode = false;
    preferences.killRules = false;
    preferences.killIndentation = false;
    modeInfo = { modeName: "Silent", description: "header" };
  } else if (matchesAny(input, ["q", "qu", "quo", "quot", "quote", "quotes"])) {
    // Spare everything except quotes
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = false;
    preferences.killQuotes = true;
    preferences.killCode = false;
    preferences.killRules = false;
    preferences.killIndentation = false;
    modeInfo = { modeName: "Silent", description: "blockquote" };
  } else if (matchesAny(input, ["c", "co", "cod", "code"])) {
    // Spare everything except code
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = false;
    preferences.killQuotes = false;
    preferences.killCode = true;
    preferences.killRules = false;
    preferences.killIndentation = false;
    modeInfo = { modeName: "Silent", description: "code block" };
  } else if (matchesAny(input, ["r", "ru", "rul", "rule", "rules"])) {
    // Spare everything except rules
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = false;
    preferences.killQuotes = false;
    preferences.killCode = false;
    preferences.killRules = true;
    preferences.killIndentation = false;
    modeInfo = { modeName: "Silent", description: "ruler" };
  } else if (matchesAny(input, ["i", "in", "ind", "inde", "inden", "indent", "indentation"])) {
    // Spare everything except indentation
    preferences.spareBullets = true;
    preferences.spareNumbers = true;
    preferences.spareLetters = true;
    preferences.killHeaders = false;
    preferences.killQuotes = false;
    preferences.killCode = false;
    preferences.killRules = false;
    preferences.killIndentation = true;
    modeInfo = { modeName: "Silent", description: "indentation" };
  } else {
    // Unrecognized input, use preferences as-is
    modeInfo = { modeName: "Custom", description: `Unknown mode: ${mode}` };
  }

  return { preferences, modeInfo };
}

// Helper function to check if input matches any of the given options
function matchesAny(input: string, options: string[]): boolean {
  return options.some((option) => option.startsWith(input) && input.length > 0);
}

// Helper function to create proper pluralized silent strike messages
function createSilentStrikeMessage(count: number, elementType: string): string {
  if (count === 0) return "Silent Strike: No targets found";

  let verb = "";
  let noun = "";

  switch (elementType) {
    case "header":
      noun = count === 1 ? "header" : "headers";
      verb = "slashed";
      break;
    case "blockquote":
      noun = count === 1 ? "blockquote" : "blockquotes";
      verb = "eliminated";
      break;
    case "code block":
      noun = count === 1 ? "code block" : "code blocks";
      verb = "obliterated";
      break;
    case "ruler":
      noun = count === 1 ? "ruler" : "rulers";
      verb = "chopped";
      break;
    case "indentation":
      noun = count === 1 ? "indentation" : "indentations";
      verb = "destroyed";
      break;
    default:
      noun = elementType;
      verb = "eliminated";
  }

  return `Silent Strike: ${count} ${noun} ${verb}`;
}

export default async function Command(props: LaunchProps<{ arguments: Arguments }>) {
  try {
    await closeMainWindow();

    const basePreferences = getPreferenceValues<Preferences>();
    const { preferences, modeInfo } = parseMode(props.arguments.mode || "", basePreferences);

    let sourceText = "";
    let hasSelectedText = false;

    try {
      sourceText = await getSelectedText();
      hasSelectedText = true;
    } catch {
      sourceText = (await Clipboard.readText()) || "";
      hasSelectedText = false;
    }

    if (!sourceText.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No text found",
      });
      return;
    }

    // Normalize line endings but preserve structure
    const normalizedText = sourceText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    let killed = 0;
    const killedTypes: string[] = [];

    // Process each line
    const cleanedText = normalizedText
      .split("\n")
      .map((line, index, array) => {
        // Track original line for indentation checking
        const originalLine = line;

        // Handle code blocks specially
        if (preferences.killCode) {
          // Check if line starts with three backticks
          if (line.trim().startsWith("```")) {
            // Remove all three backticks
            killed++;
            if (!killedTypes.includes("code")) killedTypes.push("code");
            return line.replace(/^\s*```/, "");
          }
          // Check for single-line code block (backtick followed by letter)
          if (EXCLUSIONS.code.test(line)) {
            // Remove the backtick but keep everything after it
            killed++;
            if (!killedTypes.includes("code")) killedTypes.push("code");
            return line.replace(EXCLUSIONS.code, "$1");
          }
          // If we're past the opening fence and before the closing fence, keep the line
          const openingIndex = array.findIndex((l) => EXCLUSIONS.codeBlock.test(l));
          const closingIndex = array.findIndex((l, i) => i > openingIndex && l.trim() === "```");
          if (openingIndex !== -1 && closingIndex !== -1 && index > openingIndex && index < closingIndex) {
            return line;
          }
          // If we're at the closing fence, remove it
          if (index === closingIndex) {
            return "";
          }
        }

        // First handle bullet points, numbers, and letters (if their checkboxes are unchecked)
        if (!preferences.spareBullets && BULLET_PATTERN.test(line)) {
          killed++;
          if (!killedTypes.includes("bullets")) killedTypes.push("bullets");
          // Get the indentation level from the bullet pattern match
          const match = line.match(BULLET_PATTERN);
          if (match) {
            // If there are spaces before the bullet and killIndentation is not enabled, add a tab
            const tabIndent = preferences.killIndentation ? "" : match[1] ? "\t" : "";
            return tabIndent + match[4]; // Return appropriate indentation + content
          }
          return line.replace(BULLET_PATTERN, "$4"); // Fallback to content only
        }

        // Check for numbers if enabled
        if (!preferences.spareNumbers) {
          // Use simpler patterns similar to bullet points
          const patterns = [
            /^\s*\d+[.)]\s/, // 1. 2. 1) 2) etc.
            /^\s*\(\d+\)\s/, // (1) (2) (3) etc.
          ];
          for (const pattern of patterns) {
            if (pattern.test(line)) {
              killed++;
              if (!killedTypes.includes("numbers")) killedTypes.push("numbers");
              // If there are spaces before the number and killIndentation is not enabled, add a tab
              const tabIndent = preferences.killIndentation ? "" : line.match(/^\s+/)?.[0] ? "\t" : "";
              return tabIndent + line.replace(pattern, "").trim();
            }
          }
        }

        // Check for letters if enabled
        if (!preferences.spareLetters) {
          // Use simpler patterns similar to bullet points
          const patterns = [
            /^\s*[a-zA-Z][.)]\s/, // a. A. a) A) etc.
            /^\s*\([a-zA-Z]\)\s/, // (a) (A) (b) (B) etc.
          ];
          for (const pattern of patterns) {
            if (pattern.test(line)) {
              killed++;
              if (!killedTypes.includes("letters")) killedTypes.push("letters");
              // If there are spaces before the letter and killIndentation is not enabled, add a tab
              const tabIndent = preferences.killIndentation ? "" : line.match(/^\s+/)?.[0] ? "\t" : "";
              return tabIndent + line.replace(pattern, "").trim();
            }
          }
        }

        // Then handle other markdown elements (if their checkboxes are checked)
        for (const [key, pattern] of Object.entries(EXCLUSIONS)) {
          if (pattern.test(line)) {
            // Map the key to the correct preference name
            const preferenceKey = key === "quotes" ? "killQuotes" : `kill${key.charAt(0).toUpperCase() + key.slice(1)}`;
            const kill = preferences[preferenceKey as keyof Preferences];
            if (kill) {
              killed++;
              if (!killedTypes.includes(key)) killedTypes.push(key);
              // Handle inline code specially
              if (key === "inlineCode") {
                // Remove the backticks but keep the content
                return line.replace(pattern, (match, p1) => p1.trim());
              }
              // Remove only the beginning of line characters for other elements
              return line.replace(pattern, "").trimStart();
            }
          }
        }

        // Handle indentation removal if enabled
        if (preferences.killIndentation) {
          const hasLeadingWhitespace = /^\s+/.test(originalLine);
          if (hasLeadingWhitespace) {
            killed++;
            if (!killedTypes.includes("indentation")) killedTypes.push("indentation");
            return line.replace(/^\s+/, "");
          }
        }

        // Keep everything else unchanged (preserves empty lines and spacing)
        return line;
      })
      .join("\n"); // Preserve all line breaks

    // Output
    if (hasSelectedText) {
      await Clipboard.paste(cleanedText);
    } else {
      await Clipboard.copy(cleanedText);
    }

    // Build informative title and message
    let title = "";
    let message = "";

    // Show mode if specified
    if (modeInfo.modeName !== "Custom" && props.arguments.mode?.trim()) {
      if (modeInfo.modeName === "Silent") {
        title = createSilentStrikeMessage(killed, modeInfo.description);
      } else {
        title = `${killed} ${modeInfo.description}`;
      }
      message = killedTypes.length > 0 ? killedTypes.join(", ") : "No matches found";
    } else {
      if (killed > 0) {
        title = `${killed} targets eliminated`;
        message = killedTypes.join(", ");
      } else {
        title = hasSelectedText ? "No targets found" : "Clipboard scanned, no targets";
        message = "";
      }
    }

    await showToast({
      style: Toast.Style.Success,
      title: title,
      message: message,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: String(error),
    });
  }
}
