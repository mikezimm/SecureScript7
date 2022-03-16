import * as React from 'react';

// Got from https://github.com/jianghai/code-beautify/

// 'use strict';

/**
 * Never got this to work correctly wtihout using setDangerousInnerHTML
 */

import { IBeautifyRule, IBeautifyRules, BeautifyRules, ILanguage } from './rules';

export function simpleParse( source: string ) {
  // export const regexMultiFwdSlash = /\/+/g;
  // backHalf = backHalf.replace( regexMultiFwdSlash, '\/' );
  // const findRegex = /\/>/gm;

  //This will remove all the line feeds
  source = source.replace(/(?:\r\n|\r|\n)/gm, '{splitMe}');

  source = source.replace(/ /g, '\u00a0');
  //This works to split by all tags
  const findRegex =/(?=<.*?>)|(?<=<\/.>)/gm;

  let pieces = source.split( findRegex );
  console.log( pieces );
  let biggerPieces = [ ];
  let currentLine =  '';
  for (let i = 0; i < pieces.length; i++) {
    let piece = pieces[i].trim();
    let newLines = piece.split('{splitMe}');
    console.log('newLines ' + i, newLines );
    newLines.map( line => {
      if ( line.length > 0 ) {
        currentLine += line;
        console.log('hi', i ,line);
        
        if ( line.indexOf('<!--') === 0 && line.lastIndexOf('-->') === line.length-3 ) {
          console.log('found Comment');
          let trimmedLine = currentLine.trim();
          if ( trimmedLine.length > 500 ) { biggerPieces.push( '' ); }
          console.log( 'push:', currentLine.trim()  );
          biggerPieces.push( currentLine.trim() );
          currentLine = '';
        }
        if ( line.indexOf('</') === 0  ) {
          console.log( 'push:', currentLine.trim()  );
          let trimmedLine = currentLine.trim();
          if ( trimmedLine.length > 500 ) { biggerPieces.push( '' ); }
          biggerPieces.push( currentLine.trim() );
          currentLine = '';
        }
      }
    });
  }
  if ( currentLine ) { 
    console.log( 'pushX:', currentLine.trim()  );
    biggerPieces.push( currentLine + '' ); 
  }

  console.log( 'biggerPieces',biggerPieces );

  console.log('pieces', source, pieces);

  return biggerPieces;

}

/**
 * 
 * @param source 
 * @param lang 
 * @returns 

export function parseCode(source: string, lang: ILanguage ) {

    // Remove \n in the start
    source = source.replace(/^\n/g, '');
  
    // Replace whitespace with entity
    // '\s' contains '\n', so just use ' '
    // source = source.replace(/ /g, '\u00a0');
  
    let testReg : IBeautifyRule[] = getReg(lang);
    if (testReg) {
      let rules: IBeautifyRule[] = BeautifyRules[lang];
      let reg = new RegExp(getReg(lang), 'g');
      // Refactored referencing:  https://riptutorial.com/javascript/example/8421/replacing-string-match-with-a-callback-function
      source = source.replace(reg, ( match, startIndex, wholeString ) => {
        let args = [ match, startIndex, wholeString ];
        let len = args.length - 1;
        let i = 1;
        for (; i < len; i++) {
            if (args[i] && rules[i - 1]) {
            if (rules[i - 1].callback) {
                args[i] = rules[i - 1].callback.call(null, args[i]);
            }
            return '<span class="' + rules[i - 1].name + '">' + args[i] + '</span>';
            }
        }
      });
    }

    return source.replace(/\n/g, '<br>');
  }

  function theFunction ( arr: any, rules: IBeautifyRule[] ) {
    let args = arr;
    let len = args.length - 1;
    let i = 1;
    for (; i < len; i++) {
        if (args[i] && rules[i - 1]) {
        if (rules[i - 1].callback) {
            args[i] = rules[i - 1].callback.call(null, args[i]);
        }
        return '<span class="' + rules[i - 1].name + '">' + args[i] + '</span>';
        }
    }
  }

export function parseCodeOriginal(source: string, lang: ILanguage ) {
  simpleParse( source );
  // Remove \n in the start
  source = source.replace(/^\n/g, '');

  // Replace whitespace with entity
  // '\s' contains '\n', so just use ' '
  // source = source.replace(/ /g, '\u00a0');

  let testReg : IBeautifyRule[] = getReg(lang);
  if (testReg) {
    let rules: IBeautifyRule[] = BeautifyRules[lang];
    let reg = new RegExp(getReg(lang), 'g');
    source = source.replace(reg, function() {
        let args = arguments;
        let len = args.length - 1;
        let i = 1;
        for (; i < len; i++) {
            if (args[i] && rules[i - 1]) {
            if (rules[i - 1].callback) {
                args[i] = rules[i - 1].callback.call(null, args[i]);
            }
            // return rules[i - 1].name + '{{|}}' + args[i] + '{{|||}}';
            return '<span class="' + rules[i - 1].name + '">' + args[i] + '</span>';
            }
        }
    });
  }

  return source.replace(/\n/g, '<br>');
}
 */

/**
 * Get all regexp rules of this lang.

function getReg(lang) {
  if (getReg[lang]) return getReg[lang];
  let reg = [];
  let rules = BeautifyRules[lang];
  if (rules) {
    for (let i = 0; i < rules.length; i++) {
      reg.push(rules[i].rule);
    }
  }
  let regStr = reg.join('|');

  getReg[lang] = regStr;

  return regStr;
}
 */
