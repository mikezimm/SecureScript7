
import { SPComponentLoader } from '@microsoft/sp-loader';

  export async function evalScript(elem) {
    console.log('Secure trace:  evalScript');
  const data = (elem.text || elem.textContent || elem.innerHTML || "");
  const headTag = document.getElementsByTagName("head")[0] || document.documentElement;
  const scriptTag = document.createElement("script");

  for (let i = 0; i < elem.attributes.length; i++) {
      const attr = elem.attributes[i];
      // Copies all attributes in case of loaded script relies on the tag attributes
      if(attr.name.toLowerCase() === "onload"  ) continue; // onload handled after loading with SPComponentLoader
      scriptTag.setAttribute(attr.name, attr.value);
  }

  // set a bogus type to avoid browser loading the script, as it's loaded with SPComponentLoader
  scriptTag.type = (scriptTag.src && scriptTag.src.length) > 0 ? "pnp" : "text/javascript";
  // Ensure proper setting and adding id used in cleanup on reload
  scriptTag.setAttribute("pnpname", this._unqiueId);

  try {
      // doesn't work on ie...
      scriptTag.appendChild(document.createTextNode(data));
  } catch (e) {
      // IE has funky script nodes
      scriptTag.text = data;
  }

  headTag.insertBefore(scriptTag, headTag.firstChild);
}

// Finds and executes scripts in a newly added element's body.
// Needed since innerHTML does not run scripts.
//
// Argument element is an element in the dom.
export async function executeScript(element: HTMLElement) {
    console.log('Secure trace:  executeScript');
  // clean up added script tags in case of smart re-load
  const headTag = document.getElementsByTagName("head")[0] || document.documentElement;
  let scriptTags = headTag.getElementsByTagName("script");
  for (let i = 0; i < scriptTags.length; i++) {
      const scriptTag = scriptTags[i];
      if(scriptTag.hasAttribute("pnpname") && scriptTag.attributes["pnpname"].value == this._unqiueId ) {
          headTag.removeChild(scriptTag);
      }
  }

  if (this.properties.spPageContextInfo && !window["_spPageContextInfo"]) {
      window["_spPageContextInfo"] = this.context.pageContext.legacyPageContext;
  }

  if (this.properties.teamsContext && !window["_teamsContexInfo"]) {
      window["_teamsContexInfo"] = this.context.sdks.microsoftTeams.context;
  }

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

  for (let i = 0; i < urls.length; i++) {
     let scriptUrl: any = [];
     let prefix = '';
      try {
        scriptUrl = urls[i];
          // Add unique param to force load on each run to overcome smart navigation in the browser as needed
          prefix = scriptUrl.indexOf('?') === -1 ? '?' : '&';
          scriptUrl += prefix + 'pnp=' + new Date().getTime();
          await SPComponentLoader.loadScript(scriptUrl, { globalExportsName: "ScriptGlobal" });
      } catch (error) {
        console.log('Secure trace:  error executeScript-prefix ', prefix);
        console.log('Secure trace:  error executeScript-scriptUrl ', scriptUrl);
          if (console.error) {
              console.error(error);
          }
      }
  }
  if (oldamd) {
      window["define"].amd = oldamd;
  }

  for (let i = 0; scripts[i]; i++) {
      const scriptTag = scripts[i];
      if (scriptTag.parentNode) { scriptTag.parentNode.removeChild(scriptTag); }
      console.log('Secure trace:  evalScript ' + i, scripts[i]);

      this.evalScript(scripts[i]);
  }
  // execute any onload people have added
  for (let i = 0; onLoads[i]; i++) {
      onLoads[i]();
  }
}