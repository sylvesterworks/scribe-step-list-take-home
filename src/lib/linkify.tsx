import type { ReactNode } from 'react';

import { Link, type LinkVariant } from '../ui/Link';

/**
 * A domain ending in .com, .net or .org, with an optional http(s):// in front
 * and an optional /path after. The outer parentheses are a capture group,
 * which makes `split` keep the URLs in its result instead of dropping them.
 */
const URL_PATTERN = /\b((?:https?:\/\/)?[\w-]+(?:\.[\w-]+)*\.(?:com|net|org)\b(?:\/[^\s]*)?)/g;

/**
 * Returns `text` with every URL in it wrapped in a <Link> of the given variant.
 * "Go to scribehow.com now" -> ["Go to ", <Link>scribehow.com</Link>, " now"]
 */
export function linkify(text: string, variant: LinkVariant): ReactNode[] {
  // With one capture group, split alternates: text, url, text, url, text...
  // so every odd index is a URL.
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} variant={variant} href={part.startsWith('http') ? part : `https://${part}`}>
        {part}
      </Link>
    ) : (
      part
    ),
  );
}
