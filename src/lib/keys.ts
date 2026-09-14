/**
 * Splits a Mac shortcut written the way a menu writes it ("⇧⌘]", "⌥⌘↑ / ⌥⌘↓",
 * "⇧Return") into alternatives of individual keycaps.
 *
 * The separator is a slash surrounded by spaces, never a bare one — otherwise
 * "⌘/" loses the very key it is naming.
 */
export function parseShortcut(keys: string): string[][] {
  return keys
    .split(/\s+\/\s+/)
    .map((alternative) => alternative.trim())
    .filter(Boolean)
    .map((alternative) => alternative.match(/[A-Za-z]+|[0-9]+|[^\s]/g) ?? [])
    .filter((alternative) => alternative.length > 0)
}
