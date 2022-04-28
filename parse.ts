import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"

const query ='T | project a = a + b | where a > 10.0'
const code = Kusto.Language.KustoCode.Parse(query);

(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);