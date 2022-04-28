//@ts-nocheck
import "@kusto/language-service-next/bridge"
import "@kusto/language-service-next/Kusto.Language.Bridge"
import {schema} from './schema';

function inject(fn, fn2) {
  const code = fn.toString().split('\n').slice(1,-1).join('\n');
  const code2 = fn2.toString().split('\n').slice(1,-1).join('\n');
  const res = code + '\n'.repeat(2) + code2;
  return new Function(res);
}

Kusto.Language.Syntax.SyntaxKind.AutotimestampKeyword = 532;
Kusto.Language.Syntax.SyntaxKind.AutotimestampOperator = 533;

Bridge.assembly("Kusto.Language.Bridge", function ($asm, globals) {
  "use strict";

  Bridge.define("Kusto.Language.Syntax.AutotimestampOperator", {
    inherits: [Kusto.Language.Syntax.QueryOperator],
    props: {
        Kind: {
            get: function () {
              return Kusto.Language.Syntax.SyntaxKind.AutotimestampOperator;
            }
        },
        Keyword: null,
        Parameters: null,
        ChildCount: {
            get: function () {
                return 2;
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
        ctor: function (keyword, parameters, diagnostics) {
            if (diagnostics === void 0) { diagnostics = null; }

            this.$initialize();
            Kusto.Language.Syntax.QueryOperator.ctor.call(this, diagnostics);
            this.Keyword = this.Attach(Kusto.Language.Syntax.SyntaxToken, keyword);
            this.Parameters = this.Attach(Kusto.Language.Syntax.SyntaxList$1(Kusto.Language.Syntax.NamedParameter), parameters);
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
                default: 
                    return Kusto.Language.Editor.CompletionHint.Inherit;
            }
        },
        Accept$1: function (visitor) {
            visitor.VisitAutotimestampOperator(this);
        },
        Accept: function (TResult, visitor) {
            return visitor.VisitAutotimestampOperator(this);
        },
        CloneCore: function (includeDiagnostics) {
            var $t, $t1, $t2;
            return new Kusto.Language.Syntax.AutotimestampOperator(
                ($t = this.Keyword) != null ? $t.Clone$1(includeDiagnostics) : null, 
                ($t1 = this.Parameters) != null ? $t1.Clone$2(includeDiagnostics) : null, 
                (includeDiagnostics ? this.SyntaxDiagnostics : null));
        }
    }
  });

});

// --------------- SyntaxFacts --------------

const criblSyntaxFacts = [
  new Kusto.Language.Syntax.SyntaxFacts.SyntaxData(Kusto.Language.Syntax.SyntaxKind.AutotimestampKeyword, "autotimestamp"),
  new Kusto.Language.Syntax.SyntaxFacts.SyntaxData(Kusto.Language.Syntax.SyntaxKind.AutotimestampOperator, "", Kusto.Language.Syntax.SyntaxCategory.Node)
];

for (var i = 0; i < criblSyntaxFacts.length; i++) {
  var d = criblSyntaxFacts[i];
  Kusto.Language.Syntax.SyntaxFacts.kindToDataMap[d.Kind] = d;
  if (d.Text != null) {
    Kusto.Language.Syntax.SyntaxFacts.textToKindMap.GetOrAddValue(d.Text, d.Kind);
  }
}

// ----------- QueryOperatorParameters.AutotimestampParameters ----------

let params = Object.entries(schema.properties).filter(([k,v]) => k!=='defaultTime').map(([k,v]) => {
  const p = new Kusto.Language.QueryOperatorParameter.$ctor1(k, 
    Kusto.Language.QueryOperatorParameterValueKind.NameDeclaration, true, void 0, false, System.Array.init([k], System.String));
  return p;
});

const defaultTime = new Kusto.Language.QueryOperatorParameter.$ctor1("defaultTime", Kusto.Language.QueryOperatorParameterValueKind.Word);
const defaultTimeValues = System.Array.init(["now", "last", "none"], System.String);
params.push( defaultTime.WithValues(defaultTimeValues) );

Kusto.Language.QueryOperatorParameters.AutotimestampParameters = Kusto.Language.Utils.ListExtensions.ToReadOnly(
  Kusto.Language.QueryOperatorParameter, System.Array.init(params, Kusto.Language.QueryOperatorParameter));


// ---------------- QueryParser -----------------
Kusto.Language.Parsing.QueryParser.s_autotimestampOperatorParameterMap = Kusto.Language.Parsing.QueryParser.CreateQueryOperatorParameterMap(
  Kusto.Language.QueryOperatorParameters.AutotimestampParameters);


Kusto.Language.Parsing.QueryParser.prototype.ParseAutotimestampOperator = function () {
  var keyword = this.ParseToken$1(Kusto.Language.Syntax.SyntaxKind.AutotimestampKeyword);
  if (keyword != null) {
    var parameters = this.ParseQueryOperatorParameterList(Kusto.Language.Parsing.QueryParser.s_autotimestampOperatorParameterMap);
    //var expr = this.ParseNamedExpression() || Kusto.Language.Parsing.QueryParser.CreateMissingExpression();
    return new Kusto.Language.Syntax.AutotimestampOperator(keyword, parameters);
  }

  return null;
};

const origFn = Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator;

Kusto.Language.Parsing.QueryParser.prototype.ParseQueryOperator = function() {
  switch (this.PeekToken().Kind) {
    case Kusto.Language.Syntax.SyntaxKind.AutotimestampKeyword: 
      return this.ParseAutotimestampOperator();
    default:
      return origFn.call(this);
  }
}


// ---------------- QueryGrammar -----------------

const orig = Kusto.Language.Parsing.QueryGrammar.prototype.Initialize;

Kusto.Language.Parsing.QueryGrammar.prototype.Initialize = inject(orig, () => {

  const AutotimestampOperator = Kusto.Language.Parsing.Parsers$1(Kusto.Language.Parsing.LexicalToken)
    .Rule$1(Kusto.Language.Syntax.SyntaxToken, 
      Kusto.Language.Syntax.SyntaxList$1(Kusto.Language.Syntax.NamedParameter), 
      Kusto.Language.Syntax.QueryOperator,

      Kusto.Language.Parsing.SyntaxParsers.Token$1(Kusto.Language.Syntax.SyntaxKind.AutotimestampKeyword, Kusto.Language.Editor.CompletionKind.QueryPrefix),
      QueryParameterList(Kusto.Language.QueryOperatorParameters.AutotimestampParameters),
      function (keyword, parameters) {
        return Bridge.cast(new Kusto.Language.Syntax.AutotimestampOperator(keyword, parameters), Kusto.Language.Syntax.QueryOperator);
      }
    ).WithTag$1("<autotimestamp>");

  const qo = this.QueryOperator;
  qo.Parsers[1].Parsers.push(AutotimestampOperator);
})

// ---------------- Binder -----------------
Kusto.Language.Binding.Binder.NodeBinder.prototype.VisitAutotimestampOperator = function (node) {
  var diagnostics = Kusto.Language.Binding.Binder.s_diagnosticListPool.AllocateFromPool();
  try {
    this._binder.CheckQueryOperatorParameters(node.Parameters, Kusto.Language.QueryOperatorParameters.AutotimestampParameters, diagnostics);
    return new Kusto.Language.Binding.SemanticInfo.$ctor6(diagnostics);
  } finally {
    Kusto.Language.Binding.Binder.s_diagnosticListPool.ReturnToPool(diagnostics);
  }
}

Kusto.Language.Binding.Binder.TreeBinder.prototype.VisitAutotimestampOperator = function (node) {
  var $t;
  ($t = node.Parameters) != null ? $t.Accept$1(this) : null;
  this.BindNode(node);
}

Kusto.Language.Binding.Binder.ContextBuilder.prototype.VisitAutotimestampOperator = function (node) {
  Kusto.Language.Syntax.DefaultSyntaxVisitor.prototype.VisitAutotimestampOperator.call(this, node);
};

Kusto.Language.Syntax.DefaultSyntaxVisitor.prototype.VisitAutotimestampOperator = function (node) {
  this.DefaultVisit(node);
};

Kusto.Language.Syntax.DefaultSyntaxVisitor$1.prototype.VisitAutotimestampOperator = function (node) {
  return this.DefaultVisit(node);
};


// example

const query ='T | autotimestamp srcField=foo dstField=bar defaultTimezone=local'
const code = Kusto.Language.KustoCode.Parse(query);


(Bridge as any).toArray(code.GetDiagnostics())
  .forEach(d => console.log(d.Severity, d.Code, d.Message, d.Start, d.End));

Kusto.Language.Syntax.SyntaxElement.WalkNodes(code.Syntax, 
  n => console.log([ '-'.repeat(n.Depth) + '>', n.Kind, n.NameInParent, n.toString()].join(' ') )
);