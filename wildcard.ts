//@ts-nocheck
import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"

const origParseIdentifierName = Kusto.Language.Parsing.QueryParser.prototype.ParseIdentifierName;

Kusto.Language.Parsing.QueryParser.prototype.ParseIdentifierName = function () {
  const res = this.ParseWildcardedNameReference();
  if (res) return res;
  return origParseIdentifierName.call(this);
};

const query ='T* | limit 10'
const code = Kusto.Language.KustoCode.Parse(query);


(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);