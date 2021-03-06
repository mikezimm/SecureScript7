import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneDropdownProps,
  PropertyPaneToggle,
  PropertyPaneLabel,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import { BaseComponentContext } from '@microsoft/sp-component-base';

import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';

import { SPComponentLoader } from '@microsoft/sp-loader';

import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';

// import { FPSOptionsGroupBasic, FPSBanner2Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup2';
import { FPSOptionsGroupBasic, FPSBanner3Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup3';
import { FPSBanner3BasicGroup,FPSBanner3NavGroup, FPSBanner3ThemeGroup } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup3';

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

import { approvedSites, throttleAnalytics} from './components/Security20/ApprovedLibraries';
import { approvedLibraries, } from './components/Security20/ApprovedPropPane';

import { IApprovedCDNs, IFetchInfo, approvedFileTypes, approvedFilePickerTypes, setCache } from './components/Security20/interface';

import { IAdvancedSecurityProfile } from './components/Security20/interface';  //securityProfile: IAdvancedSecurityProfile,
import { createAdvSecProfile } from './components/Security20/functions';  //securityProfile: IAdvancedSecurityProfile,

// import { fetchSnippet } from './loadDangerous';
import { baseFetchInfo, fetchSnippetMike } from './components/Security20/FetchCode';
// import { executeScript } from './components/Security20/EvalScripts';
import { executeScript } from './components/Security20/EvalScripts20';
import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';
import { visitorPanelInfo } from './components/SecureScriptVisitorPanel';

import { IWebpartHistory, IWebpartHistoryItem2 } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
import { createWebpartHistory, ITrimThis, updateWebpartHistory, upgradeV1History } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';


import { bannerThemes, bannerThemeKeys, makeCSSPropPaneString, createBannerStyleStr, createBannerStyleObj } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults';

import { saveAnalytics3 } from '@mikezimm/npmfunctions/dist/Services/Analytics/analytics2';
import { IZLoadAnalytics, IZSentAnalytics, } from '@mikezimm/npmfunctions/dist/Services/Analytics/interfaces';
import { getSiteInfo, getWebInfoIncludingUnique } from '@mikezimm/npmfunctions/dist/Services/Sites/getSiteInfo';
import { IFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/IUserInterfaces';
import { getFPSUser } from '@mikezimm/npmfunctions/dist/Services/Users/FPSUser';

import { startPerformInit, startPerformOp, updatePerformanceEnd } from './components/Performance/functions';
import { IPerformanceOp, ILoadPerformanceSS7, IHistoryPerformance } from './components/Performance/IPerformance';
import { IWebpartBannerProps } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

require('../../services/propPane/GrayPropPaneAccordions.css');

export const repoLink: IRepoLinks = links.gitRepoSecureScript7Small;

export default class SecureScript7WebPart extends BaseClientSideWebPart<ISecureScript7WebPartProps> {

  /***
 *    d8888b. d8888b. d888888b db    db  .d8b.  d888888b d88888b .d8888. 
 *    88  `8D 88  `8D   `88'   88    88 d8' `8b `~~88~~' 88'     88'  YP 
 *    88oodD' 88oobY'    88    Y8    8P 88ooo88    88    88ooooo `8bo.   
 *    88~~~   88`8b      88    `8b  d8' 88~~~88    88    88~~~~~   `Y8b. 
 *    88      88 `88.   .88.    `8bd8'  88   88    88    88.     db   8D 
 *    88      88   YD Y888888P    YP    YP   YP    YP    Y88888P `8888Y' 
 *                                                                       
 *                                                                       
 */

  private _unqiueId;
  private cdnMode:  ICDNMode = 'Webs';
  private cdnValid:  boolean = false;
  private validDocsContacts: string = '';

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private trickyApp = 'SS7';
  private wpInstanceID: any = webpartInstance( this.trickyApp );

  private FPSUser: IFPSUser = null;

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
  private filesList: any = [];

  private exitPropPaneChanged = false;

  private fetchInstance: string = Math.floor(Math.random() * 79797979 ).toString();

  // private SecureProfile: ISecurityProfile = {
  //   cssWarn: 'Warn', 
  //   cssBlock: 'Block', 
  //   jsWarn: 'Nothing', 
  //   jsBlock: 'Tenant', 
  //   imgWarn: 'Warn', 
  //   imgBlock: 'Block',
  // };

  private expandoErrorObj = {

  };

  private securityProfile: IAdvancedSecurityProfile = createAdvSecProfile();

  // Only content from the approved libraries can be selected
  // Copied from CherryPickedCE
  
  private approvedLibraries = approvedLibraries;
  private approvedSites = approvedSites;
  private approvedWebs = [];

  //ADDED FOR WEBPART HISTORY:  
  private thisHistoryInstance: IWebpartHistoryItem2 = null;

  private snippet: string = '';
  private fetchInfo: IFetchInfo = null;

  private libraryPicker = '';
  private webPicker = '';
  private libraryItemPicker = '';
  private showCodeIcon: boolean = null;

  private importErrorMessage = '';

  private bannerElement : HTMLDivElement;
  private scriptElement : HTMLDivElement;

  private consoledClassicContext = false;
  private consoledModernContext = false;

  private performance : ILoadPerformanceSS7 = null;
  private bannerProps: IWebpartBannerProps = null;
  private quickRefresh: boolean = false;

  private beAReader: boolean = false; //2022-04-07:  Intent of this is a one-time per instance to 'become a reader' level user.  aka, hide banner buttons that reader won't see

  private executedScript = false;

  private runSandbox = false;


  /***
 *     .d88b.  d8b   db d888888b d8b   db d888888b d888888b 
 *    .8P  Y8. 888o  88   `88'   888o  88   `88'   `~~88~~' 
 *    88    88 88V8o 88    88    88V8o 88    88       88    
 *    88    88 88 V8o88    88    88 V8o88    88       88    
 *    `8b  d8' 88  V888   .88.   88  V888   .88.      88    
 *     `Y88P'  VP   V8P Y888888P VP   V8P Y888888P    YP    
 *                                                          
 *                                                          
 */

  protected onInit(): Promise<void> {

    this._environmentMessage = this._getEnvironmentMessage();

    this.bannerElement = document.createElement('div');
    this.scriptElement = document.createElement('div');
    this.bannerElement.className = 'bannerElement';
    this.scriptElement.className = 'scriptElement';
    this.scriptElement.id = this.wpInstanceID;

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

      this.properties.pageLayout =  this.context['_pageLayoutType']?this.context['_pageLayoutType'] : this.context['_pageLayoutType'];
      this.urlParameters = getUrlVars();

      // DEFAULTS SECTION:  Performance   <<< ================================================================
      this.performance = startPerformInit( this.properties.spPageContextInfoClassic, this.properties.spPageContextInfoModern, this.properties.forceReloadScripts, this.displayMode, false );

      // DEFAULTS SECTION:  FPSUser
      this.FPSUser = getFPSUser( this.context, links.trickyEmails, this.trickyApp ) ;
      console.log( 'FPSUser: ', this.FPSUser );


      // DEFAULTS SECTION:  Expandoramic   <<< ================================================================
      this.expandoDefault = this.properties.expandoDefault === true && this.properties.enableExpandoramic === true && this.displayMode === DisplayMode.Read ? true : false;
      if ( this.urlParameters.Mode === 'Edit' ) { this.expandoDefault = false; }
      let expandoStyle: any = {};

      //2022-04-07:  Could use the function for parsing JSON for this... check npmFunctions
      try {
        expandoStyle = JSON.parse( this.properties.expandoStyle );

      } catch(e) {
        console.log('Unable to expandoStyle: ', this.properties.expandoStyle);
      }

      let padding = this.properties.expandoPadding ? this.properties.expandoPadding : 20;
      setExpandoRamicMode( this.context.domElement, this.expandoDefault, expandoStyle,  false, false, padding, this.properties.pageLayout  );
      this.properties.showRepoLinks = false;
      this.properties.showExport = false;

      // DEFAULTS SECTION:  Banner   <<< ================================================================
      //This updates unlocks styles only when bannerStyleChoice === custom.  Rest are locked in the ui.
      if ( this.properties.bannerStyleChoice === 'custom' ) { this.properties.lockStyles = false ; } else { this.properties.lockStyles = true; }

      if ( this.properties.bannerHoverEffect === undefined ) { this.properties.bannerHoverEffect = true; }

      if ( this.context.pageContext.site.serverRelativeUrl.toLowerCase().indexOf( '/sites/lifenet') === 0 ) {
        if ( !this.properties.bannerStyle ) { this.properties.bannerStyle = createBannerStyleStr( 'corpDark1', 'banner') ; }
        if ( !this.properties.bannerCmdStyle ) { this.properties.bannerCmdStyle = createBannerStyleStr( 'corpDark1', 'banner') ; }
      }

      // DEFAULTS SECTION:  Panel   <<< ================================================================
      if ( !this.properties.fullPanelAudience || this.properties.fullPanelAudience.length === 0 ) {
        this.properties.fullPanelAudience = 'Everyone';
      }
      if ( !this.properties.documentationLinkDesc || this.properties.documentationLinkDesc.length === 0 ) {
        this.properties.documentationLinkDesc = 'Documentation';
      }


      // DEFAULTS SECTION:  webPartHistory   <<< ================================================================
      //Preset this on existing installations
      // if ( this.properties.forceReloadScripts === undefined || this.properties.forceReloadScripts === null ) {
      //   this.properties.forceReloadScripts = false;
      // }
      //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory
      this.thisHistoryInstance = createWebpartHistory( 'onInit' , 'new', this.context.pageContext.user.displayName );
      let priorHistory : IWebpartHistoryItem2[] = this.properties.webpartHistory ? upgradeV1History( this.properties.webpartHistory ).history : [];
      this.properties.webpartHistory = {
        thisInstance: this.thisHistoryInstance,
        history: priorHistory,
      };

      
      // DEFAULTS SECTION:  SecureScript   <<< ================================================================
            //Create in web part cache

      if ( this.properties.enableHTMLCache === undefined ) { this.properties.enableHTMLCache = false; }
      if ( this.properties.htmlCache === undefined ) { this.properties.htmlCache = ''; }
      if ( this.properties.htmlAuthor === undefined ) { this.properties.htmlAuthor = ''; }
      if ( this.properties.libraryItemPickerCache === undefined ) { this.properties.libraryItemPickerCache = ''; }
      if ( this.properties.webPicker.indexOf('YOURSUBSITE') > 0 
        && this.context.pageContext.web.serverRelativeUrl.toLowerCase().indexOf('/sites/SecureCDN/'.toLowerCase()) === 0 ) { 
          this.properties.webPicker = this.context.pageContext.web.serverRelativeUrl + '/'; 
          // this.webPicker = this.context.pageContext.web.serverRelativeUrl + '/'; 
          // this.properties.libraryPicker = 'CodeLibrary';
          // this.libraryPicker  = 'CodeLibrary';

        }

    });
  }


  /***
 *    d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *    88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *    88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *    88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *    88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *    88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                     
 *                                                     
 */


  // public render(): void {
  public async render() {

    this._unqiueId = this.context.instanceId;

    // quickRefresh is used for SecureScript for when caching html file.  <<< ================================================================
    console.log(`SecureScript.ts Render:  quickRefresh, executedScript - ${this.wpInstanceID}`, this.quickRefresh, this.executedScript );
    let renderAsReader = this.displayMode === DisplayMode.Read && this.beAReader === true ? true : false;

    if ( this.quickRefresh !== true ) {

        // CLASSIC CONTEXT LOAD
        //https://github.com/mikezimm/SecureScript7/issues/71
        if (this.properties.spPageContextInfoClassic && !window["_spPageContextInfo"]) {
          window["_spPageContextInfo"] = this.context.pageContext.legacyPageContext;
        }
        //This needs to be outside of the previous loop because that seems to get triggered during inital 'view' render before going into edit mode
        if ( this.displayMode === DisplayMode.Edit && this.consoledClassicContext === false && this.properties.spPageContextInfoClassic  ) { 
          console.log('spPageContextInfoClassic:', this.context.pageContext.legacyPageContext ); this.consoledClassicContext = true;  }

        // MODERN CONTEXT LOAD
        //https://github.com/mikezimm/SecureScript7/issues/71
        if (this.properties.spPageContextInfoModern && !window["_pageContext"]) {
          window["_pageContextInfo"] = this.context.pageContext;
        }
        //This needs to be outside of the previous loop because that seems to get triggered during inital 'view' render before going into edit mode
        if ( this.displayMode === DisplayMode.Edit && this.consoledModernContext === false && this.properties.spPageContextInfoModern  ) { 
          console.log('spPageContextInfoModern:', this.context.pageContext ); this.consoledModernContext = true; }

        let errMessage = '';
        this.validDocsContacts = '';

        if ( this.properties.documentationIsValid !== true ) { errMessage += ' Invalid Support Doc Link: ' + ( this.properties.documentationLinkUrl ? this.properties.documentationLinkUrl : 'Empty.  ' ) ; this.validDocsContacts += 'DocLink,'; }
        if ( !this.properties.supportContacts || this.properties.supportContacts.length < 1 ) { errMessage += ' Need valid Support Contacts' ; this.validDocsContacts += 'Contacts,'; }

        let errorObjArray :  any[] =[];

        this.libraryPicker = encodeDecodeString(this.properties.libraryPicker, 'decode');
        this.webPicker = encodeDecodeString(this.properties.webPicker, 'decode');
        this.libraryItemPicker = this.properties.libraryItemPicker;

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

        let replacePanelWarning = `Anyone with lower permissions than '${this.properties.fullPanelAudience}' will ONLY see this content in panel`;
        let buildBannerSettings : IBuildBannerSettings = {

          FPSUser: this.FPSUser,
          //this. related info
          context: this.context ,
          clientWidth: ( this.domElement.clientWidth - ( this.displayMode === DisplayMode.Edit ? 250 : 0) ),
          exportProps: buildExportProps( this.properties, this.wpInstanceID, this.context.pageContext.web.serverRelativeUrl ),

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

          replacePanelWarning: replacePanelWarning,
          //Error info
          errMessage: errMessage,
          errorObjArray: errorObjArray, //In the case of Pivot Tiles, this is manualLinks[],
          expandoErrorObj: this.expandoErrorObj,

          beAUser: renderAsReader,
          showBeAUserIcon: null,

      };

      let showTricks: any = false;
      links.trickyEmails.map( getsTricks => {
        if ( this.context.pageContext.user.loginName && this.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { 
          showTricks = true ;
          this.properties.showRepoLinks = true; //Always show these users repo links
        }
        } );

      this.properties.showBannerGear = verifyAudienceVsUser( this.FPSUser , showTricks, this.properties.homeParentGearAudience, null, renderAsReader );
      let bannerSetup = buildBannerProps( this.properties , this.FPSUser, buildBannerSettings, showTricks, renderAsReader );
      errMessage = bannerSetup.errMessage;
      this.bannerProps = bannerSetup.bannerProps;
      let expandoErrorObj = bannerSetup.errorObjArray;

      this.showCodeIcon = verifyAudienceVsUser( this.FPSUser , showTricks, this.properties.showCodeAudience , null, renderAsReader );
      if ( this.properties.showCodeAudience && this.properties.showCodeAudience  !== 'Everyone' ) { 
        this.bannerProps.showBeAUserIcon = true;
      }

      if ( this.bannerProps.showBeAUserIcon === true ) { this.bannerProps.beAUserFunction = this.beAUserFunction.bind(this); }

      /***
     *    d88888b d88888b d888888b  .o88b. db   db      d88888b d888888b db      d88888b 
     *    88'     88'     `~~88~~' d8P  Y8 88   88      88'       `88'   88      88'     
     *    88ooo   88ooooo    88    8P      88ooo88      88ooo      88    88      88ooooo 
     *    88~~~   88~~~~~    88    8b      88~~~88      88~~~      88    88      88~~~~~ 
     *    88      88.        88    Y8b  d8 88   88      88        .88.   88booo. 88.     
     *    YP      Y88888P    YP     `Y88P' YP   YP      YP      Y888888P Y88888P Y88888P 
     *                                                                                   
     *                                                                                   
     */


      approvedSites.map( site => {
        if ( this.properties.webPicker.toLowerCase().indexOf( `${site.siteRelativeURL.toLowerCase()}/` ) > -1 ) { this.cdnValid = true; }
      });

      //Logic to test if using htmlCache or loading
      let htmlCache = this.properties.enableHTMLCache !== true ? false : '';
      let usedCache = false;
      let cahceInfo = null;

      if ( this.properties.enableHTMLCache === true && this.properties.htmlCache ) {
        htmlCache = this.properties.htmlCache;
        usedCache = true;
        cahceInfo = this.properties.cache;
        console.log(`Used Cache in ${this.wpInstanceID}` );

      } else if ( this.properties.enableHTMLCache !== true ) { 
        this.properties.htmlCache = '' ;
        this.properties.cache = setCache(); //reset cache info
        console.log(`Cleared Cache in ${this.wpInstanceID}` );

      }
      // this.snippet = await fetchSnippetMike( this.context, encodeDecodeString( webPicker, 'decode'), encodeDecodeString(libraryPicker, 'decode'), this.properties.libraryItemPicker );
      this.fetchInfo = await fetchSnippetMike( this.context, this.webPicker, this.libraryPicker, this.libraryItemPicker , this.securityProfile, this.performance, this.displayMode, htmlCache, cahceInfo, this.runSandbox );

      //Update htmlCache on web part properties if that is what is wanted
      if ( usedCache === false && this.properties.enableHTMLCache === true && this.fetchInfo.snippet && this.fetchInfo.snippet.length > 0 ) {
        this.properties.htmlCache = this.fetchInfo.snippet.trim();
        this.properties.cache = this.fetchInfo.cache;
        console.log(`Saved Cache in ${this.wpInstanceID}` );
      }

      //Reset fetchInstance which triggers some updates in react component
      this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();

      if ( this.cdnValid !== true && this.runSandbox !== true ) {

        this.fetchInfo.errorHTML = '<mark>CDN is not approved.</mark>';
        this.fetchInfo.selectedKey = 'Block';

      }

      this.fetchInfo.performance.forceReloadScripts = this.properties.forceReloadScripts;
      // bannerProps.exportProps.performance = this.fetchInfo.performance;

    } else {
      console.log('quickRefresh was true in main render');
    }

    this.properties.replacePanelHTML = visitorPanelInfo( this.properties, this.fetchInfo.performance ? this.fetchInfo.performance : null );

    this.bannerProps.replacePanelHTML = this.properties.replacePanelHTML;

  /***
 *     .o88b.  .d88b.  d8b   db .d8888. d888888b      d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b 
 *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~'      88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 
 *    8P      88    88 88V8o 88 `8bo.      88         88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    
 *    8b      88    88 88 V8o88   `Y8b.    88         88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88    
 *    Y8b  d8 `8b  d8' 88  V888 db   8D    88         88.     88booo. 88.     88  88  88 88.     88  V888    88    
 *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP         Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    
 *                                                                                                                 
 *                                                                                                                 
 */


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
        bannerProps: this.bannerProps,
        webpartHistory: this.properties.webpartHistory,

        //SecureScript props
        securityProfile: this.securityProfile,
        displayMode: this.displayMode,
        cdnMode: this.cdnMode,
        cdnValid: this.cdnValid,
        webPicker: this.webPicker,
        libraryPicker: this.libraryPicker,
        libraryItemPicker: `${this.properties.libraryItemPicker}`, //Fix downstream mutation
        fileRelativeUrl: `${this.properties.libraryItemPicker}`,
        approvedLibraries: this.approvedLibraries,
        domElement: this.domElement,
        fetchInfo: this.fetchInfo,
        fetchInstance: this.fetchInstance,
        showCodeIcon: this.showCodeIcon,

        spPageContextInfoClassic: this.properties.spPageContextInfoClassic,
        spPageContextInfoModern: this.properties.spPageContextInfoModern,

        turnSandboxOn: this.turnSandboxOn.bind( this ),
        turnSandboxOff: this.turnSandboxOff.bind( this ),

      }
    );


    /***
 *    d8888b.  .d88b.  .88b  d88.      d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *    88  `8D .8P  Y8. 88'YbdP`88      88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *    88   88 88    88 88  88  88      88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *    88   88 88    88 88  88  88      88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *    88  .8D `8b  d8' 88  88  88      88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *    Y8888D'  `Y88P'  YP  YP  YP      88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                                                      
 *                                                                                      
 */

    ReactDom.render(element, this.bannerElement);

    if ( this.executedScript === false && this.quickRefresh === false ) {

      let renderHTML = this.fetchInfo.snippet;

      //Remove any leading and trailing spaces up front
      if ( renderHTML && renderHTML.length > 0 ) { renderHTML = renderHTML.trim(); }

      //Close #31 - This was added to injext sandbox into any iframes so they don't auto-execute in edit mode
      if ( this.displayMode !== DisplayMode.Read ) {
        renderHTML = this.fetchInfo.snippet.replace(/<\s*\S*iframe/ig, '<iframe sandbox ');
      }

      if ( this.scriptElement && renderHTML) {
        this.scriptElement.innerHTML = renderHTML;
        
      } else {
        console.log('Render error:  this.scriptElement = ', this.scriptElement );
        console.log('Render error:  renderHTMLt = ', renderHTML );
      }


      if ( renderHTML === '' ) {
        //Do nothing since script is empty
      } else if ( this.runSandbox === true ) {

        this.fetchInfo.performance.jsEval = startPerformOp( 'jsEval' , this.displayMode );
        executeScript(this.scriptElement, this._unqiueId, document, this.properties.forceReloadScripts );
        this.fetchInfo.performance.jsEval = updatePerformanceEnd( this.fetchInfo.performance.jsEval, true );
      
        this.runSandbox = false;

        this.saveLoadAnalytics( 'Blocked Script', 'Blocked', this.fetchInfo, 'Blocks' );

      } else if ( this.fetchInfo.selectedKey === 'Block' ) {
        this.saveLoadAnalytics( 'Blocked Script', 'Blocked', this.fetchInfo, 'Blocks' );

      } else if ( this.fetchInfo.selectedKey === 'Warn' ) {
        if ( this.displayMode === DisplayMode.Read ) {

            this.fetchInfo.performance.jsEval = startPerformOp( 'jsEval' , this.displayMode );
            executeScript(this.scriptElement, this._unqiueId, document, this.properties.forceReloadScripts );
            this.fetchInfo.performance.jsEval = updatePerformanceEnd( this.fetchInfo.performance.jsEval, true );

          this.saveLoadAnalytics( 'Execute Script', 'Warned', this.fetchInfo, 'Warns' );
        }
      } else {
        if ( this.displayMode === DisplayMode.Read ) {

            this.fetchInfo.performance.jsEval = startPerformOp( 'jsEval' , this.displayMode );
            executeScript(this.scriptElement, this._unqiueId, document, this.properties.forceReloadScripts );
            this.fetchInfo.performance.jsEval = updatePerformanceEnd( this.fetchInfo.performance.jsEval, true );


          this.saveLoadAnalytics( 'Execute Script', this.fetchInfo.selectedKey, this.fetchInfo, 'Views' );
        }
      }

      //Render one more time to push down the updated performance stats
      this.quickRefresh = true;
      this.executedScript = true;

      this.render();

    } else {
      console.log('Already loaded and rendered the script.  Only can do once.');
    }

    
    // reset quickRefresh if render is run again
    this.quickRefresh = false;

  }

    
  //   private evalScript(elem) {
  //     console.log('Secure trace:  evalScript');
  //   const data = (elem.text || elem.textContent || elem.innerHTML || "");
  //   const headTag = document.getElementsByTagName("head")[0] || document.documentElement;
  //   const scriptTag = document.createElement("script");

  //   for (let i = 0; i < elem.attributes.length; i++) {
  //       const attr = elem.attributes[i];
  //       // Copies all attributes in case of loaded script relies on the tag attributes
  //       if(attr.name.toLowerCase() === "onload"  ) continue; // onload handled after loading with SPComponentLoader
  //       scriptTag.setAttribute(attr.name, attr.value);
  //   }

  //   // set a bogus type to avoid browser loading the script, as it's loaded with SPComponentLoader
  //   scriptTag.type = (scriptTag.src && scriptTag.src.length) > 0 ? "pnp" : "text/javascript";
  //   // Ensure proper setting and adding id used in cleanup on reload
  //   scriptTag.setAttribute("pnpname", this._unqiueId);

  //   try {
  //       // doesn't work on ie...
  //       scriptTag.appendChild(document.createTextNode(data));
  //   } catch (e) {
  //       // IE has funky script nodes
  //       scriptTag.text = data;
  //   }

  //   headTag.insertBefore(scriptTag, headTag.firstChild);
  // }

//   // Finds and executes scripts in a newly added element's body.
//   // Needed since innerHTML does not run scripts.
//   //
//   // Argument element is an element in the dom.
//   private async executeScript(element: HTMLElement) {
//     console.log('Secure trace:  executeScript');
//   // clean up added script tags in case of smart re-load
//   const headTag = document.getElementsByTagName("head")[0] || document.documentElement;
//   let scriptTags = headTag.getElementsByTagName("script");
//   for (let i = 0; i < scriptTags.length; i++) {
//       const scriptTag = scriptTags[i];
//       if(scriptTag.hasAttribute("pnpname") && scriptTag.attributes["pnpname"].value == this._unqiueId ) {
//           headTag.removeChild(scriptTag);
//       }
//   }

//   // if (this.properties.spPageContextInfo && !window["_spPageContextInfo"]) {
//   //     window["_spPageContextInfo"] = this.context.pageContext.legacyPageContext;
//   // }

//   // if (this.properties.teamsContext && !window["_teamsContexInfo"]) {
//   //     window["_teamsContexInfo"] = this.context.sdks.microsoftTeams.context;
//   // }

//   // Define global name to tack scripts on in case script to be loaded is not AMD/UMD
//   (<any>window).ScriptGlobal = {};

//   // main section of function
//   const scripts = [];
//   const children_nodes = element.getElementsByTagName("script");

//   for (let i = 0; children_nodes[i]; i++) {
//       const child: any = children_nodes[i];
//       if (!child.type || child.type.toLowerCase() === "text/javascript") {
//           scripts.push(child);
//       }
//   }

//   const urls = [];
//   const onLoads = [];
//   for (let i = 0; scripts[i]; i++) {
//       const scriptTag = scripts[i];
//       if (scriptTag.src && scriptTag.src.length > 0) {
//           urls.push(scriptTag.src);
//       }
//       if (scriptTag.onload && scriptTag.onload.length > 0) {
//           onLoads.push(scriptTag.onload);
//       }
//   }

//   let oldamd = null;
//   if (window["define"] && window["define"].amd) {
//       oldamd = window["define"].amd;
//       window["define"].amd = null;
//   }

//   for (let i = 0; i < urls.length; i++) {
//      let scriptUrl: any = [];
//      let prefix = '';
//       try {
//         scriptUrl = urls[i];
//           // Add unique param to force load on each run to overcome smart navigation in the browser as needed
//           prefix = scriptUrl.indexOf('?') === -1 ? '?' : '&';
//           scriptUrl += prefix + 'pnp=' + new Date().getTime();
//           await SPComponentLoader.loadScript(scriptUrl, { globalExportsName: "ScriptGlobal" });
//       } catch (error) {
//         console.log('Secure trace:  error executeScript-prefix ', prefix);
//         console.log('Secure trace:  error executeScript-scriptUrl ', scriptUrl);
//           if (console.error) {
//               console.error(error);
//           }
//       }
//   }
//   if (oldamd) {
//       window["define"].amd = oldamd;
//   }

//   for (let i = 0; scripts[i]; i++) {
//       const scriptTag = scripts[i];
//       if (scriptTag.parentNode) { scriptTag.parentNode.removeChild(scriptTag); }
//       console.log('Secure trace:  evalScript ' + i, scripts[i]);

//       this.evalScript(scripts[i]);
//   }
//   // execute any onload people have added
//   for (let i = 0; onLoads[i]; i++) {
//       onLoads[i]();
//   }
// }

/***
 *    d888888b db   db d88888b .88b  d88. d88888b 
 *    `~~88~~' 88   88 88'     88'YbdP`88 88'     
 *       88    88ooo88 88ooooo 88  88  88 88ooooo 
 *       88    88~~~88 88~~~~~ 88  88  88 88~~~~~ 
 *       88    88   88 88.     88  88  88 88.     
 *       YP    YP   YP Y88888P YP  YP  YP Y88888P 
 *                                                
 *                                                
 */


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

  private turnSandboxOn() {
    this.runSandbox = true;
    this.quickRefresh = false;
    this.executedScript = false;
    this.render();

  }

  private turnSandboxOff() {
    this.runSandbox = false;
    // this.quickRefresh = false;
    // this.executedScript = false;
    this.render();

  }
  
  private beAUserFunction() {
    if ( this.displayMode === DisplayMode.Edit ) {
      alert("'Be a regular user' mode is only available while viewing the page.  \n\nOnce you are out of Edit mode, please refresh the page (CTRL-F5) to reload the web part.");

    } else {
      this.beAReader = this.beAReader === true ? false : true;
      this.render();
    }

  }

  /***
 *     d888b  d88888b d888888b      db      d888888b d8888b. d8888b.  .d8b.  d8888b. d888888b d88888b .d8888. 
 *    88' Y8b 88'     `~~88~~'      88        `88'   88  `8D 88  `8D d8' `8b 88  `8D   `88'   88'     88'  YP 
 *    88      88ooooo    88         88         88    88oooY' 88oobY' 88ooo88 88oobY'    88    88ooooo `8bo.   
 *    88  ooo 88~~~~~    88         88         88    88~~~b. 88`8b   88~~~88 88`8b      88    88~~~~~   `Y8b. 
 *    88. ~8~ 88.        88         88booo.   .88.   88   8D 88 `88. 88   88 88 `88.   .88.   88.     db   8D 
 *     Y888P  Y88888P    YP         Y88888P Y888888P Y8888P' 88   YD YP   YP 88   YD Y888888P Y88888P `8888Y' 
 *                                                                                                            
 *                                                                                                            
 */


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


  /***
 *     d888b  d88888b d888888b      d88888b d888888b db      d88888b .d8888. 
 *    88' Y8b 88'     `~~88~~'      88'       `88'   88      88'     88'  YP 
 *    88      88ooooo    88         88ooo      88    88      88ooooo `8bo.   
 *    88  ooo 88~~~~~    88         88~~~      88    88      88~~~~~   `Y8b. 
 *    88. ~8~ 88.        88         88        .88.   88booo. 88.     db   8D 
 *     Y888P  Y88888P    YP         YP      Y888888P Y88888P Y88888P `8888Y' 
 *                                                                           
 *                                                                           
 */


  // Asynchronous library query
  // Copied from CherryPickedCE
  private getLibraryItemsList = (filesLocation) => {
    console.log('getLibraryItemsList', filesLocation );
    // Validate approved location
    // const filesLocation = this.approvedLibraries.filter(loc => loc.key == library)[0];

    // /_api/web/lists/getbytitle('" + filesLocation.library + "')/Items?$select=FileLeafRef
    const filesQuery = window.location.origin + filesLocation.siteRelativeURL + "_api/web/lists/getbytitle('" + filesLocation.text + "')/Items?$select=FileLeafRef,FileRef";
    // const filesQuery = window.location.origin + filesLocation.siteRelativeURL + "_api/web/lists/getbytitle('" + filesLocation.text + "')/files";

    return this.context.spHttpClient.get(filesQuery, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(data => data.value);
  }


/***
 *    d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b      .d8888. d888888b  .d8b.  d8888b. d888888b 
 *    88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'          88'  YP `~~88~~' d8' `8b 88  `8D `~~88~~' 
 *    88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo      `8bo.      88    88ooo88 88oobY'    88    
 *    88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~        `Y8b.    88    88~~~88 88`8b      88    
 *    88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.          db   8D    88    88   88 88 `88.    88    
 *    88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P      `8888Y'    YP    YP   YP 88   YD    YP    
 *                                                                                                                          
 *                                                                                                                          
 */

  // protected onPropertyPaneConfigurationComplete(): void {
  //   alert('You exited the property pane!' + this.displayMode);
  // }
  
  // protected onDisplayModeChanged(oldDisplayMode: DisplayMode): void {
  //   alert('Displaymode change from' + oldDisplayMode + ' to ' + this.displayMode );
  // }


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

      //May need to remove this check so you can run in sandbox mode after saving props to invalid CDN
      if ( isValidCDN === true || this.runSandbox === true || isValidCDN === false ) {

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

                  this.filesList = [];

                  let items = files.map(file => { 
                    this.filesList.push( { Name: file.FileLeafRef, id: file['@odata.id'], type: file['@odata.id'] });
                    return { key: file.FileRef, text: file.FileLeafRef };
                   });
      
                  //Issue #6 & #7
                  let filteredItems = [];
      
                  items.map( item => {
                    let extension = item.key.substr(item.key.lastIndexOf(".") + 1).toLowerCase();
                    if ( extension && extension.length > 0 && approvedFilePickerTypes.indexOf(extension) > -1 ) { 
                      filteredItems.push( item ) ;
                     }
                  });

                  this.libraryItemsList = sortObjectArrayByStringKey( filteredItems, 'asc', 'text' );
      
                  // enable item selector
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
        // Commenting these out so Sandbox Mode runs
        // this.properties.libraryPicker = null;
        // this.libraryItemsList = [];
      }

    } else { //No web selected, clear all sub properties
      this.properties.libraryPicker = null;
      this.libraryItemsList = [];
    }
  }

  private async _LinkIsValid(url)
  {
      //Require this is filled out.
      if ( !url ) { return false; }

      var http = new XMLHttpRequest();
      http.open('HEAD', url, false);
      let isValid = true;
      try {
        await http.send();
        isValid = http.status!=404 ? true : false;
      }catch(e) {
        isValid = false;
      }

      return isValid;
  } 

  /***
 *    d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b       .o88b. db   db  .d8b.  d8b   db  d888b  d88888b 
 *    88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'          d8P  Y8 88   88 d8' `8b 888o  88 88' Y8b 88'     
 *    88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo      8P      88ooo88 88ooo88 88V8o 88 88      88ooooo 
 *    88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~      8b      88~~~88 88~~~88 88 V8o88 88  ooo 88~~~~~ 
 *    88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.          Y8b  d8 88   88 88   88 88  V888 88. ~8~ 88.     
 *    88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P       `Y88P' YP   YP YP   YP VP   V8P  Y888P  Y88888P 
 *                                                                                                                                 
 *                                                                                                                                 
 */

  // This API is invoked after updating the new value of the property in the property bag (Reactive mode). 
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any) {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if ( propertyPath === 'documentationLinkUrl' || propertyPath === 'fpsImportProps' ) {
      this.properties.documentationIsValid = await this._LinkIsValid( newValue );
      console.log( `${ newValue ? newValue : 'Empty' } Docs Link ${ this.properties.documentationIsValid === true ? ' IS ' : ' IS NOT ' } Valid `);
      
    } else {
      if ( !this.properties.documentationIsValid ) { this.properties.documentationIsValid = false; }
    }

    let trimThis: ITrimThis = 'end';
    if ( ['webPicker','libraryPicker','libraryItemPicker','documentationLinkUrl'].indexOf(propertyPath) > -1 ) {
      trimThis = 'none';

    } else if ( [].indexOf(propertyPath) > -1 ) {
      trimThis = 'start';

    }

    //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory
    this.properties.webpartHistory = updateWebpartHistory( this.properties.webpartHistory , propertyPath , newValue, this.context.pageContext.user.displayName, trimThis );

    // console.log('webpartHistory:', this.thisHistoryInstance, this.properties.webpartHistory );


    if ( propertyPath === 'fpsImportProps' ) {

      if ( this.exitPropPaneChanged === true ) {//Added to prevent re-running this function on import.  Just want re-render. )
        this.exitPropPaneChanged = false;  //Added to prevent re-running this function on import.  Just want re-render.

      } else {
        let result = importProps( this.properties, newValue, [], importBlockProps );

        this.importErrorMessage = result.errMessage;
        if ( result.importError === false ) {
          this.properties.fpsImportProps = '';
          this.context.propertyPane.refresh();
        }
        this.exitPropPaneChanged = true;  //Added to prevent re-running this function on import.  Just want re-render.
        this.onPropertyPaneConfigurationStart();
        // this.render();
      }

    } else if ( propertyPath === 'bannerStyle' || propertyPath === 'bannerCmdStyle' )  {
      this.properties[ propertyPath ] = newValue;
      this.context.propertyPane.refresh();

    } else if (propertyPath === 'bannerStyleChoice')  {
      // bannerThemes, bannerThemeKeys, makeCSSPropPaneString

      if ( newValue === 'custom' ) {
        this.properties.lockStyles = false;

      } else if ( newValue === 'lock') {
        this.properties.lockStyles = true;

      } else {
        this.properties.lockStyles = true;
        this.properties.bannerStyle = createBannerStyleStr( newValue, 'banner' );
        this.properties.bannerCmdStyle = createBannerStyleStr( newValue, 'cmd' );

      }

      this.context.propertyPane.refresh();

    } else if ((propertyPath === 'webPicker') && (newValue) ) {
      this.fetchInstance = Math.floor(Math.random() * 79797979 ).toString();
      //Not sure what this does but am keeping same model as with libraries
      const previousItem: string = this.properties.libraryPicker;
      this.properties.libraryPicker = '';
      this.properties.libraryItemPicker = '';
      this.librariesDropdownDisabled = true;
      this.itemsDropdownDisabled = true;
      this.onPropertyPaneFieldChanged('libraryPicker', previousItem, this.properties.libraryPicker);
      
      //Added last check to only get libraries when the Url ends in /
      if ( newValue !== '' && newValue.length > 0 && newValue.charAt(newValue.length - 1) === '/' ) {
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
            this.filesList = [];

            let items = files.map(file => { 
              this.filesList.push( { Name: file.FileLeafRef, id: file['@odata.id'], type: file['@odata.id'] });
              return { key: file.FileRef, text: file.FileLeafRef };
             });

            //Issue #6 & #7
            let filteredItems = [];

            items.map( item => {
              let extension = item.key.substr(item.key.lastIndexOf(".") + 1).toLowerCase();
              if ( extension && extension.length > 0 && approvedFilePickerTypes.indexOf(extension) > -1 ) { 
                filteredItems.push( item ) ;
               }
            });
            this.libraryItemsList = sortObjectArrayByStringKey( filteredItems, 'asc', 'text' );

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


  /***
 *    d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b       d888b  d88888b d888888b 
 *    88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'          88' Y8b 88'     `~~88~~' 
 *    88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo      88      88ooooo    88    
 *    88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~      88  ooo 88~~~~~    88    
 *    88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.          88. ~8~ 88.        88    
 *    88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P       Y888P  Y88888P    YP    
 *                                                                                                         
 *                                                                                                         
 */

  
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
                  label: 'Approved web url - Must end with /',
                  description: 'Make sure to add / at end!',
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

                PropertyPaneToggle("forceReloadScripts", {
                  label: "Force reload scripts every page refresh",
                  onText: "Enabled",
                  offText: "Disabled"
                }),

                PropertyPaneToggle("enableHTMLCache", {
                  label: "Cache initial file in web part",
                  onText: "Enabled",
                  offText: "Disabled"
                }),

              ]}, // this group

            {
              groupName: 'Visitor Help Info (required)',
              isCollapsed: true,
              groupFields: [

                PropertyPaneDropdown('fullPanelAudience', <IPropertyPaneDropdownProps>{
                  label: 'Full Help Panel Audience',
                  options: expandAudienceChoicesAll,
                }),

                PropertyPaneTextField('panelMessageDescription1',{
                  label: 'Panel Description',
                  description: 'Optional message displayed at the top of the panel for the end user to see.'
                }),

                PropertyPaneTextField('panelMessageSupport',{
                  label: 'Support Message',
                  description: 'Optional message to the user when looking for support',
                }),

                PropertyPaneTextField('panelMessageDocumentation',{
                  label: 'Documentation message',
                  description: 'Optional message to the user shown directly above the Documentation link',
                }),

                PropertyPaneTextField('documentationLinkUrl',{
                  label: 'PASTE a Documentation Link',
                  description: 'REQUIRED:  A valid link to documentation - DO NOT TYPE in or webpart will lage'
                }),

                PropertyPaneTextField('documentationLinkDesc',{
                  label: 'Documentation Description',
                  description: 'Optional:  Text user sees as the clickable documentation link',
                }),

                // PropertyPaneTextField('supportContacts',{
                //   label: 'Support Contacts',
                //   description: 'REQUIRED:  Contact information for issues '
                // }),

                PropertyFieldPeoplePicker('supportContacts', {
                  label: 'Support Contacts',
                  initialData: this.properties.supportContacts,
                  allowDuplicate: false,
                  principalType: [ PrincipalType.Users, ],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  //Had to cast  to get it to work
                  //https://github.com/pnp/sp-dev-fx-controls-react/issues/851#issuecomment-978990638
                  context: this.context as any,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'peopleFieldId'
                }),



              ]}, // this group

              {
                groupName: 'Advanced - Developers only',
                isCollapsed: true,
                groupFields: [
                  PropertyPaneLabel("nothing", {
                    text: 'If you are not a developer, DO NOT USE.'
                  }),

                  PropertyPaneToggle("spPageContextInfoClassic", {
                    label: "Enable classic _spPageContextInfo",
                    checked: this.properties.spPageContextInfoClassic,
                    onText: "Enabled",
                    offText: "Disabled"
                  }),
  
                  PropertyPaneToggle("spPageContextInfoModern", {
                    label: "Enable modern _spPageContextInfo",
                    checked: this.properties.spPageContextInfoModern,
                    onText: "Enabled",
                    offText: "Disabled"
                  }),
  
              ]}, // this group

              // FPSBanner3Group( this.forceBanner , this.modifyBannerTitle, this.modifyBannerStyle, this.properties.showBanner, null, true, this.properties.lockStyles, this.properties.infoElementChoice === 'Text' ? true : false ),

              FPSBanner3BasicGroup( this.forceBanner , this.modifyBannerTitle, this.properties.showBanner, this.properties.infoElementChoice === 'Text' ? true : false ),
              FPSBanner3NavGroup(), 
              FPSBanner3ThemeGroup( this.modifyBannerStyle, this.properties.showBanner, this.properties.lockStyles, ),

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

  private async saveLoadAnalytics( Title: string, Result: string, fetchInfo: IFetchInfo, list: 'Views' | 'Edits' | 'Warns' | 'Blocks' | 'Errors'  ) {

    // Do not save anlytics while in Edit Mode... only after save and page reloads
    if ( this.displayMode === DisplayMode.Edit ) { return; }

    let loadProperties: IZLoadAnalytics = {
      SiteID: this.context.pageContext.site.id['_guid'] as any,  //Current site collection ID for easy filtering in large list
      WebID:  this.context.pageContext.web.id['_guid'] as any,  //Current web ID for easy filtering in large list
      SiteTitle:  this.context.pageContext.web.title as any, //Web Title
      TargetSite:  this.context.pageContext.web.serverRelativeUrl,  //Saved as link column.  Displayed as Relative Url
      ListID:  this.properties.libraryPicker,  //Current list ID for easy filtering in large list
      ListTitle:  this.properties.libraryPicker,
      TargetList: `/sites/SecureCDN${this.properties.libraryPicker}`,  //Saved as link column.  Displayed as Relative Url
  
    };

    let zzzRichText1Obj = fetchInfo.policyFlags.Block.map( flag => { return `${flag.cdn}` ; });
    let zzzRichText2Obj = fetchInfo.policyFlags.Warn.map( flag => { return `${flag.cdn}` ; });

    //This will get rid of all the escaped characters in the summary (since it's all numbers)
    let zzzRichText3 = JSON.stringify( fetchInfo.summary ).replace('\\','');
    //This will get rid of the leading and trailing quotes which have to be removed to make it real json object
    zzzRichText3 = zzzRichText3.slice(1, zzzRichText3.length - 1);

    console.log( 'zzzRichText1Obj:', zzzRichText1Obj);
    console.log( 'zzzRichText2Obj:', zzzRichText2Obj);

    let zzzRichText1 = null;
    let zzzRichText2 = null;

    if ( zzzRichText1Obj ) { zzzRichText1 = JSON.stringify( zzzRichText1Obj ); }
    if ( zzzRichText2Obj ) { zzzRichText2 = JSON.stringify( zzzRichText2Obj ); }
    if ( zzzRichText3 ) { zzzRichText3 = JSON.stringify( zzzRichText3 ); }

    console.log('zzzRichText1 length:', zzzRichText1 ? zzzRichText1.length : 0 );
    console.log('zzzRichText2 length:', zzzRichText2 ? zzzRichText2.length : 0 );
    console.log('zzzRichText3 length:', zzzRichText3 ? zzzRichText3.length : 0 );

    let saveObject: IZSentAnalytics = {
      loadProperties: loadProperties,

      Title: Title,  //General Label used to identify what analytics you are saving:  such as Web Permissions or List Permissions.
    
      Result: Result,  //Success or Error
    
      zzzText1: `${ this.properties.webPicker }`, 
      zzzText2: `${  this.properties.libraryPicker }`, 
      zzzText3: `${  this.properties.libraryItemPicker }`, //Info1 in some webparts.  Simple category defining results.   Like Unique / Inherited / Collection
      zzzText4: `${  fetchInfo.selectedKey }`, //Info2 in some webparts.  Phrase describing important details such as "Time to check old Permissions: 86 snaps / 353ms"
      zzzText5: `${  fetchInfo.errorHTML }`,
      zzzText6: `${ this.validDocsContacts }`,
      zzzText7: `${ this.FPSUser.simple }`,
    
      zzzNumber1: fetchInfo.fetchTime,
      zzzNumber2: fetchInfo.regexTime,
      zzzNumber3: fetchInfo.Block.length,
      zzzNumber4: fetchInfo.Warn.length,
      zzzNumber5: fetchInfo.Verify.length,
      zzzNumber6: fetchInfo.Secure.length,
      zzzNumber7: fetchInfo.js.length,
    
      zzzRichText1: zzzRichText1,  //Used to store JSON objects for later use, will be stringified
      zzzRichText2: zzzRichText2,
      zzzRichText3: zzzRichText3,

    };

    if ( fetchInfo.selectedKey === 'Warn' ) { list = 'Warns' ; }
    else if ( fetchInfo.selectedKey === 'Block' ) { list = 'Blocks' ; }

    //This section is to limit analytics on high volume pages - #13
    let capture = true;
    if ( throttleAnalytics.length > 0 && throttleAnalytics[0].serverRequestPath !== '' ) {
      throttleAnalytics.map( throttle => {
        if ( throttle.serverRequestPath === this.context.pageContext.site.serverRequestPath ) {
          let rand10X = throttle.capture * 10; //10 times the value entered in the array so capter=10, randX = 100
          let thisChance = Math.floor(Math.random() * 1000 );
          if ( thisChance > rand10X ) { capture = false; }
          console.log('capture', throttle.capture, rand10X, thisChance, capture );

          /**
           * This is the code I used to test logic of random chance
          let below = 0;
          let above = 0;

          for (let i = 0; i <  1000; i++) {

            let capture = true;
            let rand10X = 1 * 10; //10 times the value entered in the array so capter=10, randX = 100
            let thisChance = Math.floor(Math.random() * 1000 );
            if ( thisChance > rand10X ) { capture = false; above ++ } else { below ++; }

          }
          console.log('result:', below, above ); ===  "result:" 10 990 which is right about 1%
           */


        }
      });
    }
    //This will capture analytics for anything that is NOT just a view, or a certain % of views based on throttleAnalytics
    if ( list !== 'Views' || capture === true ) {
      saveAnalytics3( strings.analyticsWeb , `${strings.analyticsList}${list}` , saveObject, true );
    }


    if ( this.validDocsContacts !== '' ) {
      saveAnalytics3( strings.analyticsWeb , `${strings.analyticsList}Props` , saveObject, true );
    }

  }


}
