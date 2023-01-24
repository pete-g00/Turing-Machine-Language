import * as monaco from 'monaco-editor';
import { CodeError, CodeParser, CodeValidator } from 'parser-tml';
import themes from './editorThemes.json';

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

// based on themes defined at: https://github.com/brijeshb42/monaco-themes/blob/master/themes
monaco.editor.defineTheme("cobalt", {base: 'vs-dark', ...themes.cobalt});
monaco.editor.defineTheme("dawn", {base: 'vs', ...themes.dawn});
monaco.editor.defineTheme("dracula", {base: 'vs-dark', ...themes.dracula});
monaco.editor.defineTheme("github", {base: 'vs', ...themes.github});
monaco.editor.defineTheme("monokai", {base: "vs-dark", ...themes.monokai});
monaco.editor.defineTheme("textmate", {base: "vs", ...themes.textmate});

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
        throw error;
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
    return undefined;
}