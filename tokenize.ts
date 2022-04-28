import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"

const query ='T* | project a = a + b | where a > 10.0'

const tokens = Kusto.Language.Parsing.TokenParser.ParseTokens(query, true);
console.log(tokens.map(t => ({Text:t.Text, Trivia: t.Trivia, Length: t.Length, Kind:t.Kind})));

const res = [];
for(let i=0;i<tokens.length;i++) {
  const token = tokens[i];
  const nextToken = tokens[i+1];

  if (token.Kind === Kusto.Language.Syntax.SyntaxKind.IdentifierToken &&
      nextToken?.Trivia === '',
      nextToken?.Kind === Kusto.Language.Syntax.SyntaxKind.AsteriskToken) {
        token.Text += nextToken.Text;
        token.Length += nextToken.Length;
        i++;
      }
  res.push(token);
}

const starts = Kusto.Language.KustoCode.GetTokenStarts(res);
const code = (Kusto.Language.KustoCode as any).Create(query, null, res, starts, false);

(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);