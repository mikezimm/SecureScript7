// Got from https://github.com/jianghai/code-beautify/

export type ILanguage = 'markup' | 'css' | 'js' | 'sh' | 'java';

export interface IBeautifyRule {
    name: string;
    rule: any;
    ruleX?: any;
    callback?: any;
}

export interface IBeautifyRules {
    markup: IBeautifyRule[];
    css: IBeautifyRule[];
    js: IBeautifyRule[];
    java: IBeautifyRule[];
    sh: IBeautifyRule[];
}

export const BeautifyRules : IBeautifyRules = {
    markup: [{
      name: 'com',
      rule: '(<!--[\\s\\S]*?-->)', ///<!--.*?-->/gm
      ruleX: /<!--.*?-->/gm,
      callback: ( str: string ) => {
        return str.replace(/</g, '&lt;');
      }
    }, {
      name: 'tag',
      rule: '(<[\\\/!]?[\\w-]+|>)', //Had to add extra slash, was:  (<[\\\/!]?[\\w-]+|>)
      ruleX: /<[\\\/!]?[\\w-]+|>/gm,
      callback: ( str: string ) => {
        return str.replace('<', '&lt;');
      }
    }, {
      name: 'attr',
      rule: '\\b([\\w-:]+[=>])'
    }, {
      name: 'str', // attribute value
      rule: '(\"[\\s\\S]*?\")'
    }],
  
    css: [{
      name: 'tag',
      rule: '(<[\\/!]?[\\w\\d]+|>)',
      callback: ( str: string ) => {
        return str.replace('<', '&lt;');
      }
    }, {
      name: 'str', // attribute value
      rule: '(\"[\\s\\S]*?\")'
    }],
  
    js: [{
      name: 'com', // comment
      rule: '(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)',
      callback: ( str: string ) => {
        // Some js comment has html tags
        return str.replace(/</g, '&lt;');
      }
    }, {
      // jsx
      name: 'tag',
      rule: '(<[\\/!]?[\\w-\\.]+|>)',
      callback: ( str: string ) => {
        return str.replace('<', '&lt;');
      }
    }, {
      name: 'attr',
      rule: '\\b([\\w-:]+[=>])'
    }, {
      name: 'str', // string
      rule: '(\'[\\s\\S]*?\'|\"[\\s\\S]*?\")',
      callback: ( str: string ) => {
        // Some js string has html tags
        return str.replace(/</g, '&lt;');
      }
    }, {
      name: 'kwd', // keyword
      rule: '\\b(import|from|export|function|break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|this|throw|try|typeof|var|let|const|void|while|with)\\b'
    }, {
      name: 'kc', // key constant
      rule: '\\b(true|false|undefined|null|Infinity)\\b'
    }, {
      name: 'nb', // built-in object
      rule: '\\b(Array|console|Date|document|Function|isFinite|isNaN|Math|Object|parseInt|parseFloat|RegExp|string|window)\\b'
    }, {
      name: 'opt', // operator
      rule: '(\\+|-|\\*|\\/|%|<|>|=|==|===|!=|!==|!|&&|\\|\\||&|\\|)'
    }, {
      name: 'num', // number
      rule: '(\\d+)'
    }],
  
    sh: [{
      name: 'com', // comment
      rule: '(#.*)'
    }],
  
    java: [{
      name: 'com', // comment
      rule: '(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)'
    }, {
      name: 'kwd', // keyword
      rule: '\\b(public|class|extends|protected|void|throws)\\b'
    }]
  };