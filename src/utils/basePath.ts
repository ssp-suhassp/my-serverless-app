export function withBase(path: string = ''): string {
  if (!path) {
    return '';
  }

  if (/^(?:https?:|\/\/|mailto:|#)/i.test(path)) {
    return path;
  }

  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (!cleanBase) {
    return cleanPath;
  }

  if (cleanPath === '/') {
    return `${cleanBase}/`;
  }

  return `${cleanBase}${cleanPath}`;
}

export function rewriteHtmlSubpaths(html: string): string {
  if (!html) return '';
  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.replace(/\/+$/, '');
  if (!cleanBase) {
    return html;
  }

  const cleanBaseNoLeadingSlash = cleanBase.replace(/^\//, '');

  return html.replace(/(src|href)=["']\/([^"']+)["']/g, (match, attr, targetPath) => {
    if (targetPath.startsWith(cleanBaseNoLeadingSlash)) {
      return match;
    }
    return `${attr}="${cleanBase}/${targetPath}"`;
  });
}
