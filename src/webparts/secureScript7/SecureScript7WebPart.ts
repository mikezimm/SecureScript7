import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneDropdownProps,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import { SPComponentLoader } from '@microsoft/sp-loader';

import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';

import { FPSOptionsGroupBasic, FPSBanner2Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup2';
import { FPSOptionsExpando, expandAudienceChoicesAll } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsExpando'; //expandAudienceChoicesAll

import { WebPartInfoGroup, JSON_Edit_Link } from '@mikezimm/npmfunctions/dist/Services/PropPane/zReusablePropPane';

import * as links from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { importProps, } from '@mikezimm/npmfunctions/dist/Services/PropPane/ImportFunctions';

import { sortStringArray, sortObjectArrayByStringKey, sortNumberArray, sortObjectArrayByNumberKey, sortKeysByOtherKey 
} from '@mikezimm/npmfunctions/dist/Services/Arrays/sorting';

import { IBuildBannerSettings , buildBannerProps, IMinWPBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/BannerSetup';

import { buildExportProps } from './BuildExportProps';

import { setExpandoRamicMode } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSExpandoramic';
import { getUrlVars } from '@mikezimm/npmfunctions/dist/Services/Logging/LogFunctions';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { verifyAudienceVsUser } from '@mikezimm/npmfunctions/dist/Services/Users/CheckPermissions';

import * as strings from 'SecureScript7WebPartStrings';
import SecureScript7 from './components/SecureScript7';
import { ISecureScript7WebPartProps, exportIgnoreProps, importBlockProps, } from './ISecureScript7WebPartProps';
import { ISecureScript7Props, ICDNMode } from './components/ISecureScript7Props';


import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { approvedLibraries, approvedSites, approvedFileTypes, approvedExternalCDNs,IApprovedCDNs , ISecurityProfile, IFetchInfo } from './components/ApprovedLibraries';

// import { fetchSnippet } from './loadDangerous';
import { fetchSnippetMike } from './components/FetchCode';
import { executeScript } from './components/EvalScripts';
import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

require('../../services/propPane/GrayPropPaneAccordions.css');

export const repoLink: IRepoLinks = links.gitRepoSecureScript7Small;

export default class SecureScript7WebPart extends BaseClientSideWebPart<ISecureScript7WebPartProps> {
  private _unqiueId;
  private cdnMode:  ICDNMode = 'Webs';
  private cdnValid:  boolean = false;

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private wpInstanceID: any = webpartInstance( 'SS7' );

  //For FPS options
  private fpsPageDone: boolean = false;
  private fpsPageArray: any[] = null;
  private minQuickLaunch: boolean = false;
  private minHideHeader: boolean = false;
  private minHideToolbar: boolean = false;
  private allSectionMargin: number = -999;
  private allSectionMaxWidth: number = -999;
  private showPageHeader: boolean = null;
  private urlParameters: any = {};

  //For FPS Banner
  private forceBanner = true ;
  private modifyBannerTitle = true ;
  private modifyBannerStyle = true ;

  private  expandoDefault = false;

  private fetchInstance: string = Math.floor(Math.random() * 79797979 ).toString();

  private SecureProfile: ISecurityProfile = {
    cssWarn: 'ExternalWarn', 
    cssBlock: 'ExternalBlock', 
    jsWarn: 'Nothing', 
    jsBlock: 'Tenant', 
    imgWarn: 'ExternalWarn', 
    imgBlock: 'ExternalBlock',
  };

  private expandoErrorObj = {

  };

  // Only content from the approved libraries can be selected
  // Copied from CherryPickedCE
  
  private approvedLibraries = approvedLibraries;
  private approvedSites = approvedSites;
  private approvedWebs = [];

  private snippet: string = '';
  private fetchInfo: IFetchInfo = null;

  private importErrorMessage = '';

  private bannerElement : HTMLDivElement;
  private scriptElement : HTMLDivElement;

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    this.bannerElement = document.createElement('div');
    this.scriptElement = document.createElement('div');
    this.bannerElement.className = 'bannerElement';
    this.scriptElement.className = 'scriptElement';

    this.domElement.innerHTML = '<div></div>';
    this.domElement.appendChild(this.bannerElement);
    this.domElement.appendChild(this.scriptElement);

    return super.onInit().then(_ => {
      // other init code may be present

        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        console.log('location',window.location.href);
        if ( window.location.href &&
           window.location.href.indexOf("layouts/15/workbench.aspx") > 0  ) {

          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }

          // if ( this.properties.uniqueId && this.properties.uniqueId.length > 0 ) {} else { 
          //   this.properties.uniqueId = makeid( 7 ) ;
          // }

        } 

      // sp.setup({
      //   spfxContext: this.context
      // });

      this.urlParameters = getUrlVars();

      this.expandoDefault = this.properties.expandoDefault === true && this.properties.enableExpandoramic === true ? true : false;
      if ( this.urlParameters.Mode === 'Edit' ) { this.expandoDefault = false; }
      let expandoStyle: any = {};
      try {
        expandoStyle = JSON.parse( this.properties.expandoStyle );

      } catch(e) {

      }
      let padding = this.properties.expandoPadding ? this.properties.expandoPadding : 20;
      setExpandoRamicMode( this.context.domElement, this.expandoDefault, expandoStyle,  false, false, padding );
      this.properties.showRepoLinks = false;
      this.properties.showExport = false;
      
    });
  }

  // public render(): void {
  public async render() {
    this._unqiueId = this.context.instanceId;

    let errMessage = '';
    let errorObjArray :  any[] =[];

    let libraryPicker = encodeDecodeString(this.properties.libraryPicker, 'decode');
    let webPicker = encodeDecodeString(this.properties.webPicker, 'decode');
    let libraryItemPicker = this.properties.libraryItemPicker;

    /***
      *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b. 
      *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D 
      *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY' 
      *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b   
      *    88   8D 88   88 88  V888 88  V888 88.     88 `88. 
      *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD 
      *                                                      
      *                                                      
      */
    let buildBannerSettings : IBuildBannerSettings = {

      //this. related info
      context: this.context,
      clientWidth: this.domElement.clientWidth,
      exportProps: buildExportProps( this.properties, this.wpInstanceID ),

      //Webpart related info
      panelTitle: 'Secure Script 7 webpart - Script Editor with some controls',
      modifyBannerTitle: this.modifyBannerTitle,
      repoLinks: repoLink,

      //Hard-coded Banner settings on webpart itself
      forceBanner: this.forceBanner,
      earyAccess: false,
      wideToggle: true,
      expandAlert: false,
      expandConsole: true,

      //Error info
      errMessage: errMessage,
      errorObjArray: errorObjArray, //In the case of Pivot Tiles, this is manualLinks[],
      expandoErrorObj: this.expandoErrorObj,

  };

  let showTricks: any = false;
  links.trickyEmails.map( getsTricks => {
    if ( this.context.pageContext.user.loginName && this.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { 
      showTricks = true ; 
      this.properties.showRepoLinks = true; //Always show these users repo links
    }
    } );

  this.properties.showBannerGear = verifyAudienceVsUser( this.context, showTricks, this.properties.homeParentGearAudience, null);
  let bannerSetup = buildBannerProps( this.properties , buildBannerSettings, showTricks );
  errMessage = bannerSetup.errMessage;
  let bannerProps = bannerSetup.bannerProps;
  let expandoErrorObj = bannerSetup.errorObjArray;

  let showCodeIcon = verifyAudienceVsUser( this.context, showTricks, this.properties.showCodeAudience , null );

  // let legacyPageContext = this.context.pageContext.legacyPageContext;

  // if ( this.properties.showCodeAudience === 'WWWone' || showTricks === true ) {
  //   showCodeIcon = true;
  // } else if ( legacyPageContext.isSiteAdmin === true ) {
  //   showCodeIcon = true;
  // } else if ( ( legacyPageContext.hasManageWebPermissions === true || legacyPageContext.isSiteOwner === true ) && ( 
  //   this.properties.showCodeAudience === 'Site Owners' ) ) {
  //   showCodeIcon = true;
  //   //At some point, add for page editors but will require more thought to not slow down load.
  // } else if ( legacyPageContext.isSiteAdmin === true ) {
  //   showCodeIcon = true;
  // }

  approvedSites.map( site => {
    if ( this.properties.webPicker.toLowerCase().indexOf( `${site.siteRelativeURL.toLowerCase()}/` ) > -1 ) { this.cdnValid = true; }
  });

  if ( this.cdnValid !== true ) {
    this.snippet = '<mark>Web URL is not valid.</mark>';
  } else {
    // this.snippet = await fetchSnippetMike( this.context, encodeDecodeString( webPicker, 'decode'), encodeDecodeString(libraryPicker, 'decode'), this.properties.libraryItemPicker );
    this.fetchInfo = await fetchSnippetMike( this.context, webPicker, libraryPicker, libraryItemPicker , this.SecureProfile );
    //Reset fetchInstance which triggers some updates in react component
    this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
  }


    const element: React.ReactElement<ISecureScript7Props> = React.createElement(
      SecureScript7,
      {
        //OOTB Default Props
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        //Environement props
        // pageContext: this.context.pageContext, //This can be found in the bannerProps now
        context: this.context,
        urlVars: getUrlVars(),

        //Banner related props
        errMessage: 'any',
        bannerProps: bannerProps,

        //SecureScript props
        displayMode: this.displayMode,
        cdnMode: this.cdnMode,
        cdnValid: this.cdnValid, 
        libraryPicker: libraryPicker,
        libraryItemPicker: this.properties.libraryItemPicker,
        fileRelativeUrl: `${libraryPicker}/${this.properties.libraryItemPicker}`,
        approvedLibraries: this.approvedLibraries,
        domElement: this.domElement,
        fetchInfo: this.fetchInfo,
        fetchInstance: this.fetchInstance,
        showCodeIcon: showCodeIcon,

      }
    );

    ReactDom.render(element, this.bannerElement);
    this.scriptElement.innerHTML = this.fetchInfo.snippet;

    if ( this.fetchInfo.selectedKey !== 'ExternalBlock' ) {
      if ( this.displayMode === DisplayMode.Read ) {
        this.executeScript(this.scriptElement);
      }
    }

  }

    
    private evalScript(elem) {
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
  private async executeScript(element: HTMLElement) {
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


  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }



  // Dropdown gets disabled while retrieving items asynchronously
  // Copied from CherryPickedCE
  private itemsDropdownDisabled: boolean = true;

  //Created in SecureScript7
  private librariesDropdownDisabled: boolean = true;

  // Files in the selected library
  // Copied from CherryPickedCE

  private libraryItemsList: IPropertyPaneDropdownOption[];

  //Added in Secure Script 7
  private libraryList: IPropertyPaneDropdownOption[];

    // Asynchronous site query
  // Copied from CherryPickedCE
  private getSubsiteList = (site) => {
    // Validate approved location
    const websLocation = this.approvedSites.filter(loc => loc.key == site)[0];
    const websQuery = window.location.origin + websLocation.siteRelativeURL + "/_api/web/webs/getbytitle('" + websLocation.library + "')/files?$select=title,ServerRelativeUrl";

    return this.context.spHttpClient.get(websQuery, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(data => data.value);
  }

    // Asynchronous web query
  // Copied from CherryPickedCE
  // /sites/PivotNotInstalled/_api/Web/Lists?$filter=BaseTemplate eq 101 and Hidden eq false&select=Title
  private getLibrariesList = (web : string ) => {
    console.log('getLibrariesList', web );
    // Validate approved location
    // const websLocation = this.approvedWebs.filter(loc => loc.key == web)[0];
    // const websQuery = window.location.origin + websLocation.siteRelativeURL + "/_api/Web/Lists?$filter=BaseTemplate eq 101 and Hidden eq false&select=Title";

    let websLocation = web;
    if ( web.indexOf('/sites/') === 0 ) { websLocation = window.location.origin + websLocation ; }
    if ( websLocation.slice(-1) !== '/' ) { websLocation += '/'; }
    const websQuery = websLocation + "/_api/Web/Lists?$filter=BaseTemplate eq 101 and Hidden eq false&select=Title";
    console.log('getLibrariesList query', websQuery );

    return this.context.spHttpClient.get(websQuery, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(data => data.value);
  }

  // Asynchronous library query
  // Copied from CherryPickedCE
  private getLibraryItemsList = (filesLocation) => {
    console.log('getLibraryItemsList', filesLocation );
    // Validate approved location
    // const filesLocation = this.approvedLibraries.filter(loc => loc.key == library)[0];
    const filesQuery = window.location.origin + filesLocation.siteRelativeURL + "_api/web/lists/getbytitle('" + filesLocation.text + "')/files?$select=Name";

    return this.context.spHttpClient.get(filesQuery, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(data => data.value);
  }


  // Runs before getting the Property Pane configuration
  // Copied from CherryPickedCE
  protected onPropertyPaneConfigurationStart(): void {

    let isValidCDN : any = false; //Had to add this due to typescript error (isValidCDN was 'always false')
    this.cdnValid = false;
    this.itemsDropdownDisabled = true;
    this.librariesDropdownDisabled = true;

    let isValidWebUrl = true;
    if ( !this.properties.webPicker || this.properties.webPicker.length === 0 ) { isValidWebUrl = false; }
    if ( this.properties.webPicker.indexOf('/sites/') !== 0 && this.properties.webPicker.indexOf(window.origin ) !== 0 ) { isValidWebUrl = false; }


    if ( isValidWebUrl === true ) {

      approvedSites.map( site => {
        if ( this.properties.webPicker.toLowerCase().indexOf( `${site.siteRelativeURL.toLowerCase()}/` ) > -1 ) { isValidCDN = true; this.cdnValid = true; }
      });

      if ( isValidCDN === true ) {

        this.getLibrariesList(this.properties.webPicker)
        .then((libraries): void => {
          // store items
          
          this.libraryList = libraries.map(library => { return { key: this.properties.webPicker + library.EntityTypeName, text: library.Title, library: library.EntityTypeName, siteRelativeURL: this.properties.webPicker }; });
          let libraryListAny: any[] = this.libraryList; //Added to pass typescript
          this.approvedLibraries = libraryListAny;
          this.librariesDropdownDisabled = false;

          if (libraries.length > 0 ) {
            if (this.properties.libraryPicker) {
              // if (this.properties.libraryPicker) {
              // this.getLibraryItemsList( this.libraryList[0] )
              let libIndex = null;
        
              this.libraryList.map( ( lib, idx ) => {
                if ( lib.key === this.properties.libraryPicker ) { libIndex = idx; }
              });
        
              this.getLibraryItemsList(this.libraryList[libIndex])
                .then((files): void => {
                  // store items

                  console.log('onPropertyPaneConfigurationStart: files', files );
                  this.libraryItemsList = files.map(file => { return { key: file.Name, text: file.Name }; });
                  this.itemsDropdownDisabled = false;
                  this.context.propertyPane.refresh();
                });
            } else { 
              console.log('onPropertyPaneConfigurationStart: this.properties.libraryPicker', this.properties.libraryPicker );
              this.libraryItemsList = []; }
          }


        })
        .then(() => this.context.propertyPane.refresh());

      } else { //Invalid CDN - clear all other properties
        this.properties.libraryPicker = null;
        this.libraryItemsList = [];
      }

    } else { //No web selected, clear all sub properties
      this.properties.libraryPicker = null;
      this.libraryItemsList = [];
    }
  }

  // This API is invoked after updating the new value of the property in the property bag (Reactive mode). 
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);


    if ( propertyPath === 'fpsImportProps' ) {

      let result = importProps( this.properties, newValue, [], importBlockProps );

      this.importErrorMessage = result.errMessage;
      if ( result.importError === false ) {
        this.properties.fpsImportProps = '';
        this.context.propertyPane.refresh();
      }
      this.render();

    } else if ((propertyPath === 'webPicker') && (newValue) ) {
      this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
      //Not sure what this does but am keeping same model as with libraries
      const previousItem: string = this.properties.libraryPicker;
      this.properties.libraryPicker = '';
      this.properties.libraryItemPicker = '';
      this.librariesDropdownDisabled = true;
      this.itemsDropdownDisabled = true;
      this.onPropertyPaneFieldChanged('libraryPicker', previousItem, this.properties.libraryPicker);
      
      if ( newValue !== '' && newValue.length > 0 ) {
        this.getLibrariesList(newValue)
        .then((libraries): void => {

          if (libraries.length) {
            // store items
            this.libraryList = libraries.map(library => { return { key: this.properties.webPicker + library.EntityTypeName, text: library.Title, library: library.EntityTypeName, siteRelativeURL: this.properties.webPicker }; });
            let libraryListAny: any[] = this.libraryList; //Added to pass typescript
            this.approvedLibraries = libraryListAny;
            // enable item selector
            this.librariesDropdownDisabled = false;
            // this.render();
            // refresh the item selector control by repainting the property pane
          }
        });
      }
      this.context.propertyPane.refresh();

    } else if ((propertyPath === 'libraryPicker') && (newValue)) {
      this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
      // get previously selected item
      const previousItem: string = this.properties.libraryItemPicker;
      // reset selected item
      this.properties.libraryItemPicker = "";
      // disable item selector until new items are loaded
      this.itemsDropdownDisabled = true;
      // push new item value
      this.onPropertyPaneFieldChanged('libraryItemPicker', previousItem, this.properties.libraryItemPicker);
      // this.render();
      // refresh the item selector control by repainting the property pane
      // this.context.propertyPane.refresh();
      let libIndex = null;

      this.libraryList.map( ( lib, idx ) => {
        if ( lib.key === newValue ) { libIndex = idx; }
      });

      this.getLibraryItemsList(this.libraryList[libIndex])
        .then((files): void => {
          this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
          if (files.length) {
            // store items
            let items = files.map(file => { return { key: file.Name, text: file.Name }; });
            //Issue #6 & #7
            let filteredItems = [];
            items.map( item => {
              let extension = item.key.substr(item.key.lastIndexOf(".") + 1).toLowerCase();
              if ( extension && extension.length > 0 && approvedFileTypes.indexOf(extension) > -1 ) { filteredItems.push( item ) ; }
            });
            this.libraryItemsList = sortObjectArrayByStringKey( filteredItems, 'asc', 'key' );

            // enable item selector
            this.itemsDropdownDisabled = false;
            // this.render();
            // refresh the item selector control by repainting the property pane
            this.context.propertyPane.refresh();
          }
        });
      } else if ((propertyPath === 'libraryItemPicker') && (newValue)) {
        this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
        console.log('changed Library Item:  ', newValue );
        this.properties.libraryItemPicker = newValue;
      }

      this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true, //DONT FORGET THIS IF PROP PANE GROUPS DO NOT EXPAND
          groups: [
            WebPartInfoGroup( repoLink, 'More controlled Content Editor Webpart' ),

            {
              groupName: 'Script Editor Properties',
              groupFields: [
                // // Web Part title
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // }),
                // // Library Picker (approved libraries only)
                // PropertyPaneDropdown('sitePicker', {
                //   label: strings.LibraryPickerLabel,
                //   options: this.approvedLibraries,
                //   selectedKey: this.properties.libraryPicker,

                // }),

                // PropertyPaneDropdown('webPicker', {
                //   label: strings.LibraryPickerLabel,
                //   options: this.approvedLibraries,
                //   selectedKey: this.properties.libraryPicker,

                // }),

                PropertyPaneTextField('webPicker',{
                  label: 'Approved web url',
                }),

                PropertyPaneDropdown('libraryPicker', {
                  label: strings.LibraryPickerLabel,
                  options: this.approvedLibraries,
                  selectedKey: this.properties.libraryPicker,
                  disabled: this.librariesDropdownDisabled,

                }),
                // Cascading Library Item Picker
                PropertyPaneDropdown('libraryItemPicker', {
                  label: strings.LibraryItemPickerLabel,
                  options: this.libraryItemsList,
                  selectedKey: this.properties.libraryItemPicker,
                  disabled: this.itemsDropdownDisabled,
                }),

                PropertyPaneDropdown('showCodeAudience', <IPropertyPaneDropdownProps>{
                  label: 'Show Code Audience',
                  options: expandAudienceChoicesAll,
                }),
              ]}, // this group
              FPSBanner2Group( this.forceBanner , this.modifyBannerTitle, this.modifyBannerStyle, this.properties.showBanner, null, true ),
              FPSOptionsGroupBasic( false, true, true, true, this.properties.allSectionMaxWidthEnable, true, this.properties.allSectionMarginEnable, true ), // this group
              FPSOptionsExpando( this.properties.enableExpandoramic, this.properties.enableExpandoramic,null, null ),
  
            { groupName: 'Import Props',
            isCollapsed: true ,
            groupFields: [
              PropertyPaneTextField('fpsImportProps', {
                label: `Import settings from another SecureScript webpart`,
                description: 'For complex settings, use the link below to edit as JSON Object',
                multiline: true,
              }),
              JSON_Edit_Link,
            ]}, // this group
          ]
        }
      ]
    };
  }
}
