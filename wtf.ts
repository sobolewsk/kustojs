//@ts-nocheck
import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"

function inject(fn, fn2) {
  const code = fn.toString().split('\n').slice(1,-1).join('\n');
  const code2 = fn2.toString().split('\n').slice(1,-1).join('\n');
  const res = code + '\n'.repeat(2) + code2;
  return new Function(res);
}

Kusto.Language.Syntax.SyntaxKind.WtfKeyword = 532;
Kusto.Language.Syntax.SyntaxKind.WtfOperator = 533;

Bridge.assembly("Kusto.Language.Bridge", function ($asm, globals) {
  "use strict";

  Bridge.define("Kusto.Language.Syntax.WtfOperator", {
    inherits: [Kusto.Language.Syntax.QueryOperator],
    props: {
        Kind: {
            get: function () {
              return Kusto.Language.Syntax.SyntaxKind.WtfOperator;
            }
        },
        Keyword: null,
        Parameters: null,
        Expression: null,
        ChildCount: {
            get: function () {
                return 3;
            }
        }
    },
    ctors: {
        /**
         * Constructs a new instance of {@link }.
         *
         * @instance
         * @this Kusto.Language.Syntax.WtfOperator
         * @memberof Kusto.Language.Syntax.WtfOperator
         * @param   {Kusto.Language.Syntax.SyntaxToken}             keyword        
         * @param   {Kusto.Language.Syntax.SyntaxList$1}            parameters     
         * @param   {Kusto.Language.Syntax.Expression}              expression     
         * @param   {System.Collections.Generic.IReadOnlyList$1}    diagnostics
         * @return  {void}
         */
        ctor: function (keyword, parameters, expression, diagnostics) {
            if (diagnostics === void 0) { diagnostics = null; }

            this.$initialize();
            Kusto.Language.Syntax.QueryOperator.ctor.call(this, diagnostics);
            this.Keyword = this.Attach(Kusto.Language.Syntax.SyntaxToken, keyword);
            this.Parameters = this.Attach(Kusto.Language.Syntax.SyntaxList$1(Kusto.Language.Syntax.NamedParameter), parameters);
            this.Expression = this.Attach(Kusto.Language.Syntax.Expression, expression);
            this.Init();
        }
    },
    methods: {
        GetChild: function (index) {
            switch (index) {
                case 0: 
                    return this.Keyword;
                case 1: 
                    return this.Parameters;
                case 2: 
                    return this.Expression;
                default: 
                    throw new System.ArgumentOutOfRangeException.ctor();
            }
        },
        GetName: function (index) {
            switch (index) {
                case 0: 
                    return "Keyword";
                case 1: 
                    return "Parameters";
                case 2: 
                    return "Expression";
                default: 
                    throw new System.ArgumentOutOfRangeException.ctor();
            }
        },
        GetCompletionHintCore: function (index) {
            switch (index) {
                case 0: 
                    return Kusto.Language.Editor.CompletionHint.Keyword;
                case 1: 
                    return Kusto.Language.Editor.CompletionHint.None;
                case 2: 
                    return Kusto.Language.Editor.CompletionHint.Number;
                default: 
                    return Kusto.Language.Editor.CompletionHint.Inherit;
            }
        },
        Accept$1: function (visitor) {
            visitor.VisitTakeOperator(this);
        },
        Accept: function (TResult, visitor) {
            return visitor.VisitTakeOperator(this);
        },
        CloneCore: function (includeDiagnostics) {
            var $t, $t1, $t2;
            return new Kusto.Language.Syntax.WtfOperator(($t = this.Keyword) != null ? $t.Clone$1(includeDiagnostics) : null, ($t1 = this.Parameters) != null ? $t1.Clone$2(includeDiagnostics) : null, Bridge.cast((($t2 = this.Expression) != null ? $t2.Clone$1(includeDiagnostics) : null), Kusto.Language.Syntax.Expression), (includeDiagnostics ? this.SyntaxDiagnostics : null));
        }
    }
  });

});

Kusto.Language.Syntax.SyntaxFacts.kindToDataMap[Kusto.Language.Syntax.SyntaxKind.ProjectAwayKeyword].Text = '__project-away';
Kusto.Language.Syntax.SyntaxFacts.kindToDataMap[Kusto.Language.Syntax.SyntaxKind.LimitKeyword].Text = '__limit';

const criblSyntaxFacts = [
  new Kusto.Language.Syntax.SyntaxFacts.SyntaxData(Kusto.Language.Syntax.SyntaxKind.WtfKeyword, "wtf"),
  new Kusto.Language.Syntax.SyntaxFacts.SyntaxData(Kusto.Language.Syntax.SyntaxKind.WtfOperator, "", Kusto.Language.Syntax.SyntaxCategory.Node)
];

for (var i = 0; i < criblSyntaxFacts.length; i++) {
  var d = criblSyntaxFacts[i];
  Kusto.Language.Syntax.SyntaxFacts.kindToDataMap[d.Kind] = d;
  if (d.Text != null) {
    Kusto.Language.Syntax.SyntaxFacts.textToKindMap.GetOrAddValue(d.Text, d.Kind);
  }
}


// ---------------- QueryOperatorParameters.WtfParameters -----------------

Kusto.Language.QueryOperatorParameters.WtfParameters = Kusto.Language.Utils.ListExtensions.ToReadOnly(
  Kusto.Language.QueryOperatorParameter, System.Array.init([], Kusto.Language.QueryOperatorParameter));

Kusto.Language.Parsing.QueryParser.s_wtfOperatorParameterMap = Kusto.Language.Parsing.QueryParser.CreateQueryOperatorParameterMap(
  Kusto.Language.QueryOperatorParameters.WtfParameters);


// ---------------- QueryParser -----------------

Kusto.Language.Parsing.QueryParser.prototype.ParseWtfOperator = function () {
  var keyword = this.ParseToken$1(Kusto.Language.Syntax.SyntaxKind.WtfKeyword);
  if (keyword != null) {
    var parameters = this.ParseQueryOperatorParameterList(Kusto.Language.Parsing.QueryParser.s_wtfOperatorParameterMap, Kusto.Language.Parsing.AllowedNameKind.Known);
    var expr = this.ParseNamedExpression() || Kusto.Language.Parsing.QueryParser.CreateMissingExpression();
    return new Kusto.Language.Syntax.WtfOperator(keyword, parameters, expr);
  }

  return null;
};

const origFn = Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator;

Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator = function() {
  const res = origFn.call(this);
  return res ?? this.ParseWtfOperator();
}


// ---------------- QueryGrammar -----------------


const orig = Kusto.Language.Parsing.QueryGrammar.prototype.Initialize;

Kusto.Language.Parsing.QueryGrammar.prototype.Initialize = inject(orig, () => {

  const WtfExamples = System.Array.init(["42", "420", "4200"], System.String);

  const WtfOperator = Kusto.Language.Parsing.Parsers$1(Kusto.Language.Parsing.LexicalToken)
    .Rule$2(Kusto.Language.Syntax.SyntaxToken, 
      Kusto.Language.Syntax.SyntaxList$1(Kusto.Language.Syntax.NamedParameter), 
      Kusto.Language.Syntax.Expression, 
      Kusto.Language.Syntax.QueryOperator,
      Kusto.Language.Parsing.Parsers$1(Kusto.Language.Parsing.LexicalToken)
        .First$1(Kusto.Language.Syntax.SyntaxToken, 
          [
            Kusto.Language.Parsing.SyntaxParsers.Token$1(Kusto.Language.Syntax.SyntaxKind.WtfKeyword, Kusto.Language.Editor.CompletionKind.QueryPrefix)
          ]), 
        QueryParameterList(Kusto.Language.QueryOperatorParameters.WtfParameters, Kusto.Language.Parsing.AllowedNameKind.Known), 
        Kusto.Language.Parsing.Parsers$1(Kusto.Language.Parsing.LexicalToken)
          .Required(
            Kusto.Language.Syntax.Expression,
            Kusto.Language.Parsing.SyntaxParsers.Examples(Kusto.Language.Syntax.Expression, this.NamedExpression, WtfExamples), 
            Kusto.Language.Parsing.QueryGrammar.MissingExpression
          ),
      function (keyword, parameters, expression) {
        return Bridge.cast(new Kusto.Language.Syntax.WtfOperator(keyword, parameters, expression), Kusto.Language.Syntax.QueryOperator);
      }
    ).WithTag$1("<wtf>");

  const qo = this.QueryOperator;
  qo.Parsers[1].Parsers.push(WtfOperator);
})


const query ='T | wtf 10';
const code = Kusto.Language.KustoCode.Parse(query);


(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);