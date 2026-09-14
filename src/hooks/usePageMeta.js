import { useEffect } from 'react';
import { ORG } from '../config/theme.js';

/**
 * Set document title + meta description for SEO.
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = `${title} | ${ORG.shortName}`;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
}
