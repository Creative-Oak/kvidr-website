import {stegaClean} from '@sanity/client/stega'

/**
 * Strips the invisible stega characters Sanity adds for Visual Editing.
 *
 * Stega is what lets Presentation map rendered text back to the field that
 * produced it, so it must stay on anything displayed as text. It must be
 * removed from everything else: values used as logic (an icon name, a shortcut
 * to be parsed), values parsed as data (dates), and anything written into an
 * HTML attribute (href, alt, datetime, meta content) where the hidden
 * characters are at best noise and at worst a broken URL.
 */
export const clean = <T>(value: T): T => stegaClean(value) as T
