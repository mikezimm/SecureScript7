/**
 * The purpose of this file is to build the FPS Banner props in a standard way.
 * To benefit from typescript, it's meant to be copied to the specific webpart using it
 */

 import * as React from 'react';
 import * as ReactDom from 'react-dom';
 
 import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
 
 import "@pnp/sp/webs";
 import "@pnp/sp/site-groups/web";
 
 /***
  *    d888888b .88b  d88. d8888b.  .d88b.  d8888b. d888888b      d8b   db d8888b. .88b  d88.      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
  *      `88'   88'YbdP`88 88  `8D .8P  Y8. 88  `8D `~~88~~'      888o  88 88  `8D 88'YbdP`88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
  *       88    88  88  88 88oodD' 88    88 88oobY'    88         88V8o 88 88oodD' 88  88  88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
  *       88    88  88  88 88~~~   88    88 88`8b      88         88 V8o88 88~~~   88  88  88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
  *      .88.   88  88  88 88      `8b  d8' 88 `88.    88         88  V888 88      88  88  88      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
  *    Y888888P YP  YP  YP 88       `Y88P'  88   YD    YP         VP   V8P 88      YP  YP  YP      YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
  *                                                                                                                                                                              
  *                                                                                                                                                                              
  */
 
 import * as links from '@mikezimm/npmfunctions/dist/Links/LinksRepos';
 
 import { createStyleFromString, getReactCSSFromString, ICurleyBraceCheck } from '@mikezimm/npmfunctions/dist/Services/PropPane/StringToReactCSS';
 import { IWebpartBannerProps, } from './components/HelpPanel/banner/onNpm/bannerProps';
 
 import { getHelpfullError, getHelpfullErrorV2 } from '@mikezimm/npmfunctions/dist/Services/Logging/ErrorHandler';
 
 import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';
 
 export interface IMinWPBannerProps {
 
     showBannerGear: boolean;
 
     // Section 15
     //General settings for Banner Options group
     // export interface IWebpartBannerProps {
     bannerTitle: string;
     bannerStyle: string;
     showBanner: boolean;
 
     showGoToHome: boolean;  //defaults to true
     showGoToParent: boolean;  //defaults to true
 
     bannerHoverEffect: boolean;
 
     //2022-02-17:  Added these for expandoramic mode
   enableExpandoramic: boolean;
   expandoDefault: boolean;
   expandoStyle: any;
     expandoPadding: number;
 
     fpsContainerMaxWidth: string;
   
 }
 
 export interface IBuildBannerSettings {
 
     //this. related info
     context: WebPartContext;
     clientWidth: number;
     exportProps: any;
 
     //Webpart related info
     panelTitle: string;
     modifyBannerTitle: boolean;
     repoLinks: IRepoLinks;
 
     //Hard-coded Banner settings on webpart itself
     forceBanner: boolean;
     earyAccess: boolean;
     wideToggle: boolean;
     expandAlert: boolean;
     expandConsole: boolean;
 
     //Error info
     errMessage: string;
     errorObjArray: any []; //In the case of Pivot Tiles, this is manualLinks[];
     expandoErrorObj: any;
 
 }
 
 /**
  * This function builds up the final bannerProps object that is passed to the banner component
  * @param wpProps 
  * @param bbs 
  * @returns 
  */
 export function buildBannerProps ( wpProps : IMinWPBannerProps, bbs: IBuildBannerSettings ) {
 
     
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
 
      let showTricks = false;
      links.trickyEmails.map( getsTricks => {
        if ( bbs.context.pageContext.user.loginName && bbs.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { showTricks = true ; }   } ); 
  
      let bannerTitle = bbs.modifyBannerTitle === true && wpProps.bannerTitle && wpProps.bannerTitle.length > 0 ? wpProps.bannerTitle : `Secure Script 7`;
      let bannerStyle: ICurleyBraceCheck = getReactCSSFromString( 'bannerStyle', wpProps.bannerStyle, {background: "#7777",fontWeight:600, fontSize: 'larger', height: '43px'} );
      let showBannerGear = wpProps.showBannerGear === false ? false : true;
 
      let anyContext: any = bbs.context;
      console.log('_pageLayoutType:', anyContext._pageLayoutType );
      console.log('pageLayoutType:', anyContext.pageLayoutType );
 
     let expandobuildExpandoStyle = buildExpandoStyle( bbs.errMessage, wpProps, bbs.errorObjArray, bbs.expandoErrorObj );
 
     let showBannerError = bbs.errMessage !== '' && bbs.errMessage !== null ? true : false; 
 
      let bannerProps: IWebpartBannerProps = {
 
       exportProps: bbs.exportProps,
       pageContext: bbs.context.pageContext,
       panelTitle: bbs.panelTitle,
       bannerWidth : bbs.clientWidth,
       showBanner: bbs.forceBanner === true || wpProps.showBanner !== false ? true : false,
       showTricks: showTricks,
       showBannerGear: showBannerGear,
       showGoToHome: wpProps.showGoToHome === false ? false : true,
       showGoToParent: wpProps.showGoToParent === false ? false : true,
 
       // onHomePage: anyContext._pageLayoutType === 'Home' ? true : false,
       onHomePage: bbs.context.pageContext.legacyPageContext.isWebWelcomePage === true ? true : false,
       hoverEffect: wpProps.bannerHoverEffect === false ? false : true,
 
       //This was my modified attempt that didn't work
       title: showBannerError === true ? bbs.errMessage : bannerTitle ,
       bannerReactCSS: showBannerError === true ?  { background: "yellow", color: "red", } : bannerStyle.parsed ,
 
       gitHubRepo: bbs.repoLinks,
       farElements: [],
       nearElements: [],
       earyAccess: bbs.earyAccess,
       wideToggle: bbs.wideToggle,
 
       //2022-02-17:  Added these for expandoramic mode
       domElement: bbs.context.domElement,
       enableExpandoramic: wpProps.enableExpandoramic,
       expandoDefault: wpProps.expandoDefault,
       expandoStyle: expandobuildExpandoStyle.expandoStyle,
       expandAlert: bbs.expandAlert,
       expandConsole: bbs.expandConsole,
       expandoPadding: wpProps.expandoPadding,
       //2022-02-17:  END additions for expandoramic mode
 
     };
 
      //close #129:  This makes the maxWidth added in fps options apply to banner as well.
      if ( wpProps.fpsContainerMaxWidth && wpProps.fpsContainerMaxWidth.length > 0 ) {
        bannerProps.bannerReactCSS.maxWidth = wpProps.fpsContainerMaxWidth;
      }
 
      return { errMessage: bbs.errMessage, bannerProps: bannerProps, errorObjArray: expandobuildExpandoStyle.errorObjArray, };
 
 }
 
 export function buildExpandoStyle( errMessage: string, wpProps : IMinWPBannerProps, errorObjArray: any[], expandoErrorObj: any ) {
 
     let expandoStyle : any = {};
     let expandoError : boolean = false;
     if  ( wpProps.expandoStyle && wpProps.expandoStyle.length > 0 ) {
       try {
         expandoStyle = JSON.parse( wpProps.expandoStyle );
 
       } catch (e) {
         let errMessageManLinks = getHelpfullError(e, false, true) ;
         console.log('Unable to parse expandoStyle Links:' , wpProps.expandoStyle );
 
         errMessage += errMessage.length > 0 ? ' -- ' : '';
         errMessage += 'Error parsing expandoStyle.  Check JSON.  ' +  errMessageManLinks;
 
         expandoError = true;
         errorObjArray.push( expandoErrorObj );
       }
     }
 
     return { expandoStyle: expandoStyle, expandoError: expandoError, errorObjArray: errorObjArray, };
 
 
 }