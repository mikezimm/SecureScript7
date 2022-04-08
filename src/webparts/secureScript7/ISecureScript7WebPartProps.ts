
// changes = changeScript, changeExpando, changeBanner, changefpsOptions1, changefpsOptions2, 

import { IExpandAudiences } from "@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsExpando";

import { IWebpartHistory, IWebpartHistoryItem2, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
import { createWebpartHistory, updateWebpartHistory } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';

import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";

import { IAdvancedSecurityProfile } from './components/Security20/interface';  //securityProfile: IAdvancedSecurityProfile,

import { IPerformanceOp, ILoadPerformanceSS7, IHistoryPerformance } from './components/Performance/IPerformance';

export const changeExpando = [ 
  'enableExpandoramic','expandoDefault','expandoStyle', 'expandoPadding', 'expandoAudience',
  ];

 export const changeScript = [ 'sitePicker', 'webPicker', 'libraryPicker', 'libraryItemPicker', 'showCodeAudience', 'forceReloadScripts' ];

export const changeVisitor = [ 'panelMessageDescription1', 'panelMessageSupport', 'panelMessageDocumentation', 'documentationLinkDesc', 'documentationLinkUrl', 'documentationIsValid', 'supportContacts' ];

export const changeAdvanced = [ 'spPageContextInfoClassic', 'spPageContextInfoModern', ];

export const changeBanner = [ 'showBanner', 'bannerTitle', 'showGoToHome', 'showGoToParent', 'homeParentGearAudience', 'bannerStyleChoice', 'bannerStyle', 'bannerCmdStyle', 'bannerHoverEffect', 'showRepoLinks', 'showExport', 'lockStyles' ];

export const changefpsOptions1 = [  'searchShow', 'quickLaunchHide', 'pageHeaderHide', 'allSectionMaxWidthEnable', 'allSectionMaxWidth', 'allSectionMarginEnable', 'allSectionMargin', 'toolBarHide', ];

 export const changefpsOptions2 = [  'fpsPageStyle', 'fpsContainerMaxWidth' ];


//, exportIgnoreProps, importBlockProps, importBlockPropsDev
//These props will not be exported even if they are in one of the change arrays above (fail-safe)
//This was done to always insure these values are not exported to the user
export const exportIgnoreProps = [
  'analyticsList', 'analyticsWeb', 
];

//These props will not be imported even if they are in one of the change arrays above (fail-safe)
//This was done so user could not manually insert specific props to over-right fail-safes built in to the webpart
export const importBlockProps = [
  'scenario', 'analyticsList', 'analyticsWeb', 'lastPropDetailChange', 'showBanner' , 'showTricks', 'showRepoLinks', 'showExport', 'fpsImportProps', 'fullPanelAudience', 'documentationIsValid', 'currentWeb', 'loadPerformance', 'webpartHistory', 
];

//This will be in npmFunctions > Services/PropPane/FPSOptionsExpando in next release.
//  export type IExpandAudiences = 'Site Admins' | 'Site Owners' | 'Page Editors' | 'WWWone';




export interface ISecureScript7WebPartProps {
    description: string;
  
    uniqueId: string;
    showBannerGear: boolean; // Not in Prop Pane
    
    //2022-02-17:  Added these for expandoramic mode
    enableExpandoramic: boolean;
    expandoDefault: boolean;
    expandoStyle: any;
    expandoPadding: number;
    expandoAudience: IExpandAudiences;
    
      // expandAlert: boolean;
      // expandConsole: boolean;
      //2022-02-17:  END additions for expandoramic mode
  
    // Section 15
    //General settings for Banner Options group
    // export interface IWebpartBannerProps {

    //[ 'showBanner', 'bannerTitle', 'showGoToHome', 'showGoToParent', 'homeParentGearAudience', 'bannerStyleChoice', 'bannerStyle', 'bannerCmdStyle', 'bannerHoverEffect', 'showRepoLinks', 'showExport' ];
      showBanner: boolean;
      bannerTitle: string;

      infoElementChoice: string;
      infoElementText: string;
      
      showGoToHome: boolean;  //defaults to true
      showGoToParent: boolean;  //defaults to true
      homeParentGearAudience: IExpandAudiences;

      bannerStyleChoice: string;
      bannerStyle: string;
      bannerCmdStyle: string;
      lockStyles: boolean;

      bannerHoverEffect: boolean;
      showRepoLinks: boolean;
      showExport: boolean;

      fullPanelAudience : IExpandAudiences;
      replacePanelHTML : any;  //This is the jsx sent to panel for User controled information (aka what reader will see when clicking 'info' button)

      //These are added for the minimum User Panel component ( which turns into the replacePanelHTML component )
      panelMessageDescription1: string; //
      panelMessageSupport: string;
      panelMessageDocumentation: string;
      documentationLinkDesc: string;
      documentationLinkUrl: string;
      documentationIsValid: boolean;
      supportContacts: IPropertyFieldGroupOrPerson[];

      //ADDED FOR WEBPART HISTORY:  
      webpartHistory: IWebpartHistory;


      showTricks: boolean;

    // }
  
    //Section 16 - FPS Options group
    searchShow: boolean;
    fpsPageStyle: string;
    fpsContainerMaxWidth: string;
    quickLaunchHide: boolean;
  
    //FPS Options part II
    pageHeaderHide: boolean;
    allSectionMaxWidthEnable: boolean;
    allSectionMaxWidth: number;
    allSectionMarginEnable: boolean;
    allSectionMargin: number;
    toolBarHide: boolean;

    //SecureScript Props for CE Code
    sitePicker: string;
    webPicker: string;
    libraryPicker: string;
    libraryItemPicker: string;
    showCodeAudience: IExpandAudiences;

    spPageContextInfoClassic: boolean;
    spPageContextInfoModern: boolean;

    forceReloadScripts: boolean;  // 2022-04-04:  Added this to try and resolve https://github.com/mikezimm/SecureScript7/issues/72

    loadPerformance: ILoadPerformanceSS7;

    fpsImportProps: string;

  }
