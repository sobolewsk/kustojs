//@ts-nocheck
import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"

const exclude = [
  Kusto.Language.Syntax.SyntaxKind.ProjectAwayKeyword,
  Kusto.Language.Syntax.SyntaxKind.LimitKeyword
]

const origFn = Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator;

Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator = function() {
  const kind = this.PeekToken().Kind;
  if (exclude.includes(kind)) return null;
  return origFn.call(this);
}

const query ='T | limit 10'
const code = Kusto.Language.KustoCode.Parse(query);

(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);