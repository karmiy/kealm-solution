# Convert

Markdown & HTML & PlainText 相互转换方案

```ts
// md -> html
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

export const md2Html = (md: string) => {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify)
    .processSync(md)
    .toString();
};
```

```ts
// html -> plain text
import { convert } from 'html-to-text';

const html = '<div>Hello World</div>';
const text = convert(html, { wordwrap: false });
```