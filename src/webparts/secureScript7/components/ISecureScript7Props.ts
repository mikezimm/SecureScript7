import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IWebpartBannerProps, } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IWebpartHistory, IWebpartHistoryItem2, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';

import { IApprovedCDNs, IFetchInfo, ITagInfo, ISecurityProfile, IApprovedFileType, ICDNCheck , approvedFileTypes, } from './Security20/interface';

import { IAdvancedSecurityProfile } from './Security20/interface';
 
/***
 *    d8888b. d8888b.  .d88b.  d8888b. .d8888. 
 *    88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP 
 *    88oodD' 88oobY' 88    88 88oodD' `8bo.   
 *    88~~~   88`8b   88    88 88~~~     `Y8b. 
 *    88      88 `88. `8b  d8' 88      db   8D 
 *    88      88   YD  `Y88P'  88      `8888Y' 
 *                                             
 *                                             
 */

export type ICDNMode = 'Webs' | 'Libraries';

export interface ISecureScript7Props {

  //OOTB Props
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

  displayMode: DisplayMode;

  //Environement props
  // pageContext: PageContext;
  context: WebPartContext;
  urlVars: {};

  //Banner related props
  errMessage: any;
  bannerProps: IWebpartBannerProps;

  spPageContextInfoClassic: boolean;
  spPageContextInfoModern: boolean;

  //Secure Script Props
  cdnMode: ICDNMode;
  cdnValid: boolean;

  webPicker: string;

  libraryPicker: string;
  libraryItemPicker: string;
  approvedLibraries: any[];
  fileRelativeUrl: string;

  securityProfile: IAdvancedSecurityProfile;


  // context: WebPartContext;

  domElement: any;
  fetchInfo: IFetchInfo;
  fetchInstance: string;
  showCodeIcon: boolean;

  turnSandboxOn: any; //Call back to web part to reload and execute Blocked scripts
  turnSandboxOff: any; //Call back to web part to reload and execute Blocked scripts


  //ADDED FOR WEBPART HISTORY:  
  webpartHistory: IWebpartHistory;

}

/***
 *    .d8888. d888888b  .d8b.  d888888b d88888b 
 *    88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *    `8bo.      88    88ooo88    88    88ooooo 
 *      `Y8b.    88    88~~~88    88    88~~~~~ 
 *    db   8D    88    88   88    88    88.     
 *    `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                              
 *                                              
 */
export type IScope = 'Loaded File' | 'Current Webpart' | 'Entire Page';
export interface ISecureScript7State {

  fetchInfo: IFetchInfo;
  
  //Prop Panel Help
  showPropsHelp: boolean;


  lastStateChange: string;
  showDevHeader: boolean;
  isSiteAdmin: boolean;

  showOriginalHtml: boolean;
  showApprovedLocations: boolean;
  showRawHTML: boolean;
  showProfileLogic: boolean;
  showPanel: boolean;
  panelFileType: IApprovedFileType;
  panelSource: ICDNCheck;
  
  fullBlockedHeight: boolean;
  toggleTag: 'files' | 'tags';

  contextWarnClassic: string;
  contextWarnModern: string;
  
  scope: IScope;

  selectedKey: ICDNCheck | IApprovedFileType | 'raw';
  selectedKeyFile: ICDNCheck | IApprovedFileType | 'raw';

  searchValue: string;

  showCacheInfo: boolean;

  isDialogVisible: boolean;
  currentlySandbox: boolean;
  
}
