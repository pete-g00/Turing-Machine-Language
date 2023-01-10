import * as monaco from 'monaco-editor';
import { CodeError, CodeParser, CodeValidator } from 'parser-tml';

monaco.languages.register({id: "TMProgram"});

const keywords = ['alphabet', 'module', 'switch', 'if', 'while', 'move', 'changeto', 'goto'];
const typeKeywords = ["accept", "reject", "left", "right", "blank", "tapehead"];

monaco.languages.setMonarchTokensProvider("TMProgram", {
    ignoreCase: false,
    defaultToken: 'invalid',
    tokenizer: {
        root: [
            [/[a-zA-Z0-9_$][\w$]*/, {
                cases: {
                    '@typeKeywords': 'predefined',
                    '@keywords': 'keyword',
                    '@default': 'identifier',
                }
            }],
            [/\/\/.*$/, 'comment'],
            [/[{}]/, "delimiter.curly"],
            [/[,=]/, 'delimiter'],
        ]
    },
    comments: [
        [/\/\//, 'comment']
    ],
    keywords,
    typeKeywords
});

// based on the Dracula theme: https://github.com/brijeshb42/monaco-themes/blob/master/themes/Dracula.json
monaco.editor.defineTheme("TMProgramTheme-dark", {
    base: "vs-dark",
    rules: [
        {background: "282a36", token: ""},
        {foreground: "6272a4", token: "comment"},
        {foreground: "50fa7b", token: "identifier"},
        {foreground: "ff79c6", token: "keyword"},
        {foreground: "bd93f9", token: "predefined"},
        {foreground: "f44747", background: "c82829", token: "invalid"},
    ],
    inherit: true,
    colors: {
        "editor.foreground": "#f8f8f2",
        "editor.background": "#282a36",
        "editor.selectionBackground": "#44475a",
        "editor.lineHighlightBackground": "#44475a",
        "editorCursor.foreground": "#f8f8f0",
        "editorWhitespace.foreground": "#3B3A32",
        "editorIndentGuide.activeBackground": "#9D550FB0",
        "editor.selectionHighlightBorder": "#222218"
    }
});

function getCompletionItem(model:monaco.editor.ITextModel, position:monaco.Position, keyword:string) {
    return {
        label: keyword,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: keyword,
        range: {
            startLineNumber: position.lineNumber,
            startColumn: model.getWordAtPosition(position)!.startColumn,
            endColumn: position.column,
            endLineNumber: position.lineNumber,
        }
    };
}

monaco.languages.registerCompletionItemProvider("TMProgram", {
    provideCompletionItems: (model, position) => {
        const suggestions = [
            ...keywords.map(keyword => getCompletionItem(model, position, keyword)),
            ...typeKeywords.map(keyword => getCompletionItem(model, position, keyword))
        ];
        return {suggestions};
    }
});

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId:any, label:string) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

monaco.languages.setLanguageConfiguration('TMProgram', {
    surroundingPairs: [
        {open: '{', close: '}'}
    ],
    autoClosingPairs: [
        {open: '{', close: '}'},
    ],
    indentationRules: {
        increaseIndentPattern: /{/,
        decreaseIndentPattern: /}/,
    },
    comments: {
        lineComment: "//"
    }
});

function catchError(source:string, error:unknown, markers:monaco.editor.IMarkerData[]) {
    try {
        markers.push({
            endColumn: (error as CodeError).position.endColNumber+1,
            endLineNumber: (error as CodeError).position.endLineNumber,
            message: (error as CodeError).message,
            severity: monaco.MarkerSeverity.Error,
            startColumn: (error as CodeError).position.startColNumber+1,
            startLineNumber: (error as CodeError).position.startLineNumber+1,
            source,
        });
    } catch {
        console.log("Not a CodeError!");
    }
}

export function getProgram(code:string, markers:monaco.editor.IMarkerData[]) {
    markers.pop();
    const parser = new CodeParser(code);
    try {
        const program = parser.parse();
        const validator = new CodeValidator(program);
        try {
            validator.validate();
            return program;
        } catch (error) {
            catchError("TMValidator", error, markers);
        }
    } catch (error) {
        catchError("TMParser", error, markers);
    }
}