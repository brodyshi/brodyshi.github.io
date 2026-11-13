---
title: Markdown 语法支持
description: 本博客基于 VitePress 的主题和文章样式进行开发，这篇文章主要用于介绍对 Markdown 的语法支持和对照真实渲染样式。
published: 2026-11-13T19:25:25+08:00
tags: [Markdown, VitePress]
draft: false
---

本博客基于 [VitePress](https://vitepress.dev/zh/) 的主题和文章样式进行开发。这篇文章主要用于介绍对 Markdown 的语法支持和对照真实渲染样式。

每组「输入」是写进 `.md` 文件的源码，「输出」是它的渲染结果。

## 标题和目录

正文可以从二级标题开始。页面会根据 `##` 和 `###` 生成「本页目录」，并为标题加上可以分享的锚点。

**输入**

```md
## 标题和目录

[跳到「标题和目录」](#标题和目录)
```

**输出**

「标题和目录」就是当前小节的标题，也出现在本页目录中。下面的链接会跳到这个标题。也可以点击标题旁的 `#` 获取带锚点的网址。

[跳到「标题和目录」](#标题和目录)

## 正文排版

在段落之间留一个空行。用 `**文字**` 加粗，用 `_文字_` 写斜体，用 `~~文字~~` 加删除线。行内代码用反引号包起来，引用以 `>` 开头。

用 `- ` 开始无序列表项。在列表标记后加 `[ ]` 或 `[x]`，就可以用复选框表示待完成或已完成的任务。

链接写作 `[链接文字](地址)`，图片写作 `![替代文字](地址)`。

**输入**

```md
**粗体**、_斜体_、~~删除线~~和 `行内代码`。

> 这是一段引用。

- [归档](/posts/)
- [标签](/tags/)

发布前检查

- [x] 写好示例
- [ ] 检查渲染效果

![分享封面](/og.jpg)
```

**输出**

**粗体**、_斜体_、~~删除线~~和 `行内代码`。

> 这是一段引用。

- [归档](/posts/)
- [标签](/tags/)

发布前检查

- [x] 写好示例
- [ ] 检查渲染效果

![分享封面](/og.jpg)

## 表格

用 `|` 分隔各列，表头下方用短横线标出各列的对齐方式。`---` 默认左对齐，`:---:` 居中，`---:` 右对齐。

**输入**

```md
| Fruit  | Color  | Quantity |
| ------ | :----: | -------: |
| Apple  |  Red   |       12 |
| Banana | Yellow |        8 |
```

**输出**

| Fruit  | Color  | Quantity |
| ------ | :----: | -------: |
| Apple  |  Red   |       12 |
| Banana | Yellow |        8 |

## 提示框和折叠块

### 提示框

开头写 `:::`，紧接类型名，例如 `:::tip`。接着写正文，最后另起一行用 `:::` 结束。每种类型都有自己的配色和默认标题。

**输入**

```md
:::note
用说明框补充背景或解释术语，例如交代某种写法的适用范围。
:::

:::info
提示框的正文支持 Markdown，可以写 **粗体**、链接或列表。
:::

:::tip
写提示框时，可以在开头和结尾各留一个空行，让它和前后的段落分开。
:::

:::warning
如果结尾漏写了 `:::`，后续段落可能也会被包进提示框。
:::

:::danger
遇到可能造成数据丢失的操作，可以用警告框把风险放在操作步骤前。
:::
```

**输出**

:::note
用说明框补充背景或解释术语，例如交代某种写法的适用范围。
:::

:::info
提示框的正文支持 Markdown，可以写 **粗体**、链接或列表。
:::

:::tip
写提示框时，可以在开头和结尾各留一个空行，让它和前后的段落分开。
:::

:::warning
如果结尾漏写了 `:::`，后续段落可能也会被包进提示框。
:::

:::danger
遇到可能造成数据丢失的操作，可以用警告框把风险放在操作步骤前。
:::

### 自定义标题和隐藏标题

把标题写在类型名后面的方括号里，例如 `:::tip[自定义标题示例]`。要隐藏提示框的标题，在类型名后加 `{no-title}`。

**输入**

```md
:::tip[自定义标题示例]
这个提示框使用方括号里的「自定义标题示例」作为标题。
:::

:::note{no-title}
加上 `{no-title}` 后，提示框只显示正文。
:::
```

**输出**

<!-- eslint-disable markdown/no-missing-label-refs -- This label is a directive title. -->

:::tip[自定义标题示例]
这个提示框使用方括号里的「自定义标题示例」作为标题。
:::

<!-- eslint-enable markdown/no-missing-label-refs -->

:::note{no-title}
加上 `{no-title}` 后，提示框只显示正文。
:::

### 折叠块

`:::details` 默认收起，点击标题可以展开或收起内容。默认标题是「展开查看」，也可以用方括号自定义标题。在开头加 `{open}`，页面加载时就会展开。折叠内容可以继续使用 Markdown，例如列表和行内代码。

**输入**

```md
:::details
你点开了一个默认收起的折叠块。再点一次「展开查看」就能收起这段文字。
:::

:::details[默认展开的折叠块]{open}

- 方括号里的文字会显示为折叠块标题。
- `{open}` 让内容在页面加载时展开，点击标题可以收起。

:::
```

**输出**

:::details
你点开了一个默认收起的折叠块。再点一次「展开查看」就能收起这段文字。
:::

<!-- eslint-disable markdown/no-missing-label-refs -- This label is a directive title. -->

:::details[默认展开的折叠块]{open}

- 方括号里的文字会显示为折叠块标题。
- `{open}` 让内容在页面加载时展开，点击标题可以收起。

:::

<!-- eslint-enable markdown/no-missing-label-refs -->

## 代码块

用三个反引号围住代码，在开头注明语言，例如 `ts`。Shiki 会按语言着色，并把行尾标记渲染成对应的效果。在独立代码块的开头加上 `[src/fibonacci.ts]` 可以显示文件名，受支持的文件类型还会显示图标。

### 行号和行高亮

代码块默认隐藏行号。`:line-numbers` 从 1 开始编号，`:line-numbers=7` 从 7 开始编号，`:no-line-numbers` 隐藏行号。

高亮位置按源码行数计算。例如 `{2,4-5}` 会高亮第 2、4、5 行。下面的 `{4}` 高亮更新斐波那契数列相邻两项的语句。因为显示行号从 7 开始，这一行标为 10。

**输入**

````md
```ts{4}:line-numbers=7 [src/fibonacci.ts]
function fibonacci(n: number): number {
  let [current, next] = [0, 1];
  for (let i = 0; i < n; i++) {
    [current, next] = [next, current + next];
  }
  return current;
}

console.log(fibonacci(7)); // 13
```
````

**输出**

```ts{4}:line-numbers=7 [src/fibonacci.ts]
function fibonacci(n: number): number {
  let [current, next] = [0, 1];
  for (let i = 0; i < n; i++) {
    [current, next] = [next, current + next];
  }
  return current;
}

console.log(fibonacci(7)); // 13
```

### 注释行高亮

也可以用行尾注释 `// [!code highlight]` 高亮当前行。渲染后，筛选偶数的那一行会带有高亮背景，标记本身会隐藏。

**输入**

````text
```ts
const values = [1, 2, 3, 4];
const evens = values.filter((n) => n % 2 === 0); // [!code highlight]
console.log(evens); // [2, 4]
```
````

**输出**

```ts
const values = [1, 2, 3, 4];
const evens = values.filter((n) => n % 2 === 0); // [!code highlight]
console.log(evens); // [2, 4]
```

### 行聚焦

在行尾加 `// [!code focus]`，突出辗转相除法的递归步骤，同时淡化其余行。

**输入**

````text
```ts
function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b); // [!code focus]
}

console.log(gcd(48, 18)); // 6
```
````

**输出**

```ts
function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b); // [!code focus]
}

console.log(gcd(48, 18)); // 6
```

### 差异标记

用 `// [!code --]` 标出删除行，用 `// [!code ++]` 标出新增行。下面将筛选条件从「大于等于 2」改为「等于 2」。复制代码时会跳过删除行。

**输入**

````text
```ts
const values = [2, 4, 2, 6];
const matches = values.filter((n) => n >= 2); // [!code --]
const matches = values.filter((n) => n === 2); // [!code ++]
console.log(matches.length); // 2
```
````

**输出**

```ts
const values = [2, 4, 2, 6];
const matches = values.filter((n) => n >= 2); // [!code --]
const matches = values.filter((n) => n === 2); // [!code ++]
console.log(matches.length); // 2
```

### 警告标记

用 `// [!code warning]` 提醒读者留意某一行。下面把超出上限的分数截为 100。

**输入**

````text
```ts
const score = 120;
const capped = Math.min(score, 100); // [!code warning]
console.log(capped); // 100
```
````

**输出**

```ts
const score = 120;
const capped = Math.min(score, 100); // [!code warning]
console.log(capped); // 100
```

### 错误标记

用 `// [!code error]` 标出错误处理。下面求数组的平均值，数组为空时会抛出异常。

**输入**

````text
```ts
function average(values: number[]): number {
  if (values.length === 0) {
    throw new RangeError('Empty array'); // [!code error]
  }
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

console.log(average([2, 4, 6])); // 4
```
````

**输出**

```ts
function average(values: number[]): number {
  if (values.length === 0) {
    throw new RangeError('Empty array'); // [!code error]
  }
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

console.log(average([2, 4, 6])); // 4
```

### 代码组

用 `:::code-group` 和 `:::` 包住多个代码块，组内只写代码块。方括号里的文字会成为标签名，省略时使用语言名。

下面的两个标签页都演示如何安装 KaTeX。点击复制按钮会复制当前标签页的命令，并去掉 Shell 行首的 `$ ` 或 `> ` 提示符。

**输入**

````md
:::code-group

```sh [pnpm]
$ pnpm add katex
```

```sh [npm]
$ npm install katex
```

:::
````

**输出**

:::code-group

```sh [pnpm]
$ pnpm add katex
```

```sh [npm]
$ npm install katex
```

:::

## 数学公式

本站用 KaTeX 渲染公式。行内公式用一对 `$` 包起来，独立公式用两行 `$$` 包起来。

### 斐波那契数列

**输入**

```md
斐波那契数列从 $F_0=0$、$F_1=1$ 开始。之后每一项都是前两项的和。

$$
F_n = F_{n-1} + F_{n-2}, \qquad n \ge 2
$$

把第 5 项和第 6 项相加，得到 $F_7=F_6+F_5=8+5=13$。
```

**输出**

斐波那契数列从 $F_0=0$、$F_1=1$ 开始。之后每一项都是前两项的和。

$$
F_n = F_{n-1} + F_{n-2}, \qquad n \ge 2
$$

把第 5 项和第 6 项相加，得到 $F_7=F_6+F_5=8+5=13$。

### 辗转相除法

用 `aligned` 排列多行等式，用 `&` 标出等号的对齐位置，用 `\\` 换行。

**输入**

```md
对两个正整数求最大公约数时，每一步都把 $(a,b)$ 更新为 $(b,a\bmod b)$，最大公约数保持不变。第二个数变为 $0$ 时，第一个数就是结果。

$$
\begin{aligned}
\gcd(48,18) &= \gcd(18,12) \\
            &= \gcd(12,6) \\
            &= \gcd(6,0) = 6
\end{aligned}
$$
```

**输出**

对两个正整数求最大公约数时，每一步都把 $(a,b)$ 更新为 $(b,a\bmod b)$，最大公约数保持不变。第二个数变为 $0$ 时，第一个数就是结果。

$$
\begin{aligned}
\gcd(48,18) &= \gcd(18,12) \\
            &= \gcd(12,6) \\
            &= \gcd(6,0) = 6
\end{aligned}
$$

## 参考资料

- [VitePress 的 Markdown 扩展文档](https://vitepress.dev/zh/guide/markdown)
