const emptyFun = () => {
    return undefined;
};

export const editor = {
    defineTheme: emptyFun,
    create: () => {
        return {dispose: emptyFun};
    },
    dispose: emptyFun
};

export const languages =  {
    register: emptyFun,
    registerCompletionItemProvider: emptyFun,
    setLanguageConfiguration: emptyFun,
    setMonarchTokensProvider: emptyFun
};