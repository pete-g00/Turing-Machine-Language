const emptyFun = () => {
    return undefined;
};

export const editor = {
    defineTheme: emptyFun,
    create: () => {
        return {
            dispose: emptyFun,
            onDidChangeModelContent: emptyFun,
            updateOptions: emptyFun,
            getModel: emptyFun,
        };
    },
    dispose: emptyFun,
    setModelMarkers: emptyFun
};

export const languages =  {
    register: emptyFun,
    registerCompletionItemProvider: emptyFun,
    setLanguageConfiguration: emptyFun,
    setMonarchTokensProvider: emptyFun
};