import { createElement } from "react";
import { CodeBlock } from "./CodeBlock";
import { Diagram } from "./Diagram";
import type { DocNode, DocPage } from "./model";
import { pages } from "./pages";

function Node({ node }: { node: DocNode }) {
  if (node.code !== undefined) return node.language === "mermaid"
    ? <Diagram code={node.code} /> : <CodeBlock code={node.code} label={["sh", "bash", "shell"].includes(node.language ?? "") ? "Terminal" : node.language ?? "Example"} />;
  if (node.html !== undefined) return <span className="doc-inline" dangerouslySetInnerHTML={{ __html: node.html }} />;
  const { class: className, style, ...attrs } = node.attrs ?? {};
  const styles = style ? Object.fromEntries(style.split(";").filter(Boolean).map((rule) => {
    const [name, value] = rule.split(":");
    return [name.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()), value.trim()];
  })) : undefined;
  return createElement(node.tag ?? "div", { ...attrs, className, style: styles }, node.children?.map((child, i) => <Node key={i} node={child} />));
}
export function DocArticle({ page }: { page: DocPage }) {
  const overview = page.path === "/docs";
  const next = pages[pages.indexOf(page) + 1];
  return <>
    <header id={overview ? "overview" : undefined} className={`doc-article-heading ${overview ? "docs-overview" : ""}`}>
      <p className="eyebrow">{overview ? "DEVELOPER DOCUMENTATION" : page.group}</p>
      <h1>{overview ? <>Local workflows.<br /><em>Closer to the work.</em></> : page.title}</h1>
      <p className="docs-lead">{page.description}</p>
      {overview && <>
        <div className="docs-notice">One shared workspace. Two independent tools. Bellows runs your GitHub Actions; Kiln supplies the Wolfi runner. Keep hosted CI for platform coverage and merge enforcement.</div>
        <div className="docs-base"><span>Kiln + Bellows · local feedback</span><code>github.com/smeltery/stoke</code></div>
        <p className="docs-flow"><a href="/docs/getting-started/">Assemble the workspace</a>, <a href="/docs/bellows/quickstart/">run a workflow</a>, and <a href="/docs/kiln/usage/">choose your runner environment</a>.</p>
      </>}
    </header>
    {page.sections.map((section) => <section id={section.id} key={section.id}>
      {section.id !== "overview" && <h2>{section.title}</h2>}
      {section.nodes.map((node, i) => <Node node={node} key={i} />)}
    </section>)}
    {next && <a className="doc-next" href={`${next.path}/`}><span>Continue reading</span>{next.title} →</a>}
  </>;
}
