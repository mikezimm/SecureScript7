
import { SPComponentLoader } from '@microsoft/sp-loader';

import { getHelpfullErrorV2, saveThisLogItem } from  '@mikezimm/npmfunctions/dist/Services/Logging/ErrorHandler';

import { _LinkIsValid, _LinkStatus } from "@mikezimm/npmfunctions/dist/Links/AllLinks";

/***
 *    d88888b db    db  .d8b.  db           .d8888.  .o88b. d8888b. d888888b d8888b. d888888b 
 *    88'     88    88 d8' `8b 88           88'  YP d8P  Y8 88  `8D   `88'   88  `8D `~~88~~' 
 *    88ooooo Y8    8P 88ooo88 88           `8bo.   8P      88oobY'    88    88oodD'    88    
 *    88~~~~~ `8b  d8' 88~~~88 88             `Y8b. 8b      88`8b      88    88~~~      88    
 *    88.      `8bd8'  88   88 88booo.      db   8D Y8b  d8 88 `88.   .88.   88         88    
 *    Y88888P    YP    YP   YP Y88888P      `8888Y'  `Y88P' 88   YD Y888888P 88         YP    
 *                                                                                            
 *                                                                                            
 */

export async function evalScript(elem, _unqiueId: string, thisDocument: Document) {
    console.log('Secure trace:  evalScript');
  const data = (elem.text || elem.textContent || elem.innerHTML || "");
  const headTag = thisDocument.getElementsByTagName("head")[0] || thisDocument.documentElement;
  const scriptTag = thisDocument.createElement("script");

  for (let i = 0; i < elem.attributes.length; i++) {
      const attr = elem.attributes[i];
      // Copies all attributes in case of loaded script relies on the tag attributes
      if(attr.name.toLowerCase() === "onload"  ) continue; // onload handled after loading with SPComponentLoader
      scriptTag.setAttribute(attr.name, attr.value);
  }

  // set a bogus type to avoid browser loading the script, as it's loaded with SPComponentLoader
  scriptTag.type = (scriptTag.src && scriptTag.src.length) > 0 ? "pnp" : "text/javascript";
  // Ensure proper setting and adding id used in cleanup on reload
  scriptTag.setAttribute("pnpname", _unqiueId);

  try {
      // doesn't work on ie...
      scriptTag.appendChild(thisDocument.createTextNode(data));
  } catch (e) {
      // IE has funky script nodes
      scriptTag.text = data;
      let errMessage = getHelpfullErrorV2( e, true, true, 'evalScript ~ 40' );

  }
  console.log('_unqiueId, scriptTag, child:', _unqiueId, scriptTag, headTag.firstChild );

    try {
        // doesn't work on ie...
        headTag.insertBefore(scriptTag, headTag.firstChild);
    } catch (e) {
        let errMessage = getHelpfullErrorV2( e, true, true, 'evalScript ~ 40' );
    }

}

//Sent to @mikezimm/npmfunctions@1.0.226
// export async function _LinkIsValid(url, consoleLog : boolean = true, extraMessage: string = '' )
// {
//     //Require this is filled out.
//     if ( !url ) { return false; }

//     var http = new XMLHttpRequest();
//     http.open('HEAD', url, false);
//     let isValid = true;
//     let errMessage = '';
//     try {
    
//       await http.send();
//       isValid = http.status!=404 ? true : false;
//       if ( isValid === false && consoleLog === true ) {
//         errMessage = `${extraMessage} Location does not seem to exist ~ 68:  ${url}`;
//         console.log( errMessage );
//       }

//     }catch(e) {

//       isValid = false;
//       errMessage = getHelpfullErrorV2( e, true, true, '_LinkIsValid ~ 75' );
//       if ( consoleLog === true ) {
//         console.log( `${extraMessage} Location does not seem to exist:  ${url}` );
//         console.log( errMessage );

//       }
//     }

//     return isValid === true ? '' : 'Link is not valid';
// } 
/***
 *    d88888b db    db d88888b  .o88b. db    db d888888b d88888b      .d8888.  .o88b. d8888b. d888888b d8888b. d888888b 
 *    88'     `8b  d8' 88'     d8P  Y8 88    88 `~~88~~' 88'          88'  YP d8P  Y8 88  `8D   `88'   88  `8D `~~88~~' 
 *    88ooooo  `8bd8'  88ooooo 8P      88    88    88    88ooooo      `8bo.   8P      88oobY'    88    88oodD'    88    
 *    88~~~~~  .dPYb.  88~~~~~ 8b      88    88    88    88~~~~~        `Y8b. 8b      88`8b      88    88~~~      88    
 *    88.     .8P  Y8. 88.     Y8b  d8 88b  d88    88    88.          db   8D Y8b  d8 88 `88.   .88.   88         88    
 *    Y88888P YP    YP Y88888P  `Y88P' ~Y8888P'    YP    Y88888P      `8888Y'  `Y88P' 88   YD Y888888P 88         YP    
 *                                                                                                                      
 *                                                                                                                      
 */

// Finds and executes scripts in a newly added element's body.
// Needed since innerHTML does not run scripts.
//
// Argument element is an element in the dom.
export async function executeScript(element: HTMLElement, _unqiueId: string, thisDocument: Document, forceReloadScripts: boolean ) {
  console.log('Secure trace:  executeScript');
    // clean up added script tags in case of smart re-load
    const headTag = thisDocument.getElementsByTagName("head")[0] || thisDocument.documentElement;
    let scriptTags = headTag.getElementsByTagName("script");
    for (let i = 0; i < scriptTags.length; i++) {
        const scriptTag = scriptTags[i];
        if(scriptTag.hasAttribute("pnpname") && scriptTag.attributes["pnpname"].value == _unqiueId ) {
            headTag.removeChild(scriptTag);
        }
    }

    // if (this.properties.spPageContextInfo && !window["_spPageContextInfo"]) {
    //     window["_spPageContextInfo"] = this.context.pageContext.legacyPageContext;
    // }

    // if (this.properties.teamsContext && !window["_teamsContexInfo"]) {
    //     window["_teamsContexInfo"] = this.context.sdks.microsoftTeams.context;
    // }

    // Define global name to tack scripts on in case script to be loaded is not AMD/UMD
    (<any>window).ScriptGlobal = {};

    // main section of function
    const scripts = [];
    const children_nodes = element.getElementsByTagName("script");

    for (let i = 0; children_nodes[i]; i++) {
        const child: any = children_nodes[i];
        if (!child.type || child.type.toLowerCase() === "text/javascript") {
            scripts.push(child);
        }
    }

    const urls = [];
    const onLoads = [];
    for (let i = 0; scripts[i]; i++) {
        const scriptTag = scripts[i];
        if (scriptTag.src && scriptTag.src.length > 0) {
            urls.push(scriptTag.src);
        }
        if (scriptTag.onload && scriptTag.onload.length > 0) {
            onLoads.push(scriptTag.onload);
        }
    }

    let oldamd = null;
    if (window["define"] && window["define"].amd) {
        oldamd = window["define"].amd;
        window["define"].amd = null;
    }

    let startLoad = new Date ().getTime();
    for (let i = 0; i < urls.length; i++) {
        let scriptUrl: any = [];
        let prefix = '';

        scriptUrl = urls[i];

        prefix = scriptUrl.indexOf('?') === -1 ? '?' : '&';

        // 2022-04-04:  Added this to try and resolve https://github.com/mikezimm/SecureScript7/issues/72
        // Add unique param to force load on each run to overcome smart navigation in the browser as needed
        if ( forceReloadScripts !== false ) { //Using !== false to force same behaviour on prior web part instances
            scriptUrl += prefix + 'pnp=' + new Date().getTime();
        } else {
            // scriptUrl += prefix + 'pnp=' + 'fuzzyPawsSolutions';
        }

        console.log('await SPComponentLoader.loadScript: ', scriptUrl );
        let errMessage = await _LinkIsValid( scriptUrl, true, 'Can not run SPComponentLoader on...');
        //Only try to execute script if it exists.
        if ( errMessage === '' ) {
            try {
            await SPComponentLoader.loadScript(scriptUrl, { globalExportsName: "ScriptGlobal" });
            } catch (error) {
                console.log('Secure trace:  error executeScript-prefix ', prefix);
                console.log('Secure trace:  error executeScript-scriptUrl ', scriptUrl);
                if (console.error) {
                    console.error(error);
                }
            }
        }
    }

    let endLoad = new Date ().getTime();

    console.log('Load Performance: forceReloadScripts, ms: ', forceReloadScripts, ( endLoad-startLoad ) );

    if (oldamd) {
        window["define"].amd = oldamd;
    }

    for (let i = 0; scripts[i]; i++) {
        const scriptTag = scripts[i];
        console.log('Secure trace:  evalScript ' + i, scripts[i]);
        if (scriptTag.parentNode) { scriptTag.parentNode.removeChild(scriptTag); }


        evalScript(scripts[i], _unqiueId, thisDocument,  );
    }
    // execute any onload people have added
    for (let i = 0; onLoads[i]; i++) {
        onLoads[i]();
    }
}