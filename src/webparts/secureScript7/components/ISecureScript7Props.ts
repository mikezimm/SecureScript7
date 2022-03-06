import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IWebpartBannerProps, } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

import { DisplayMode, Version } from '@microsoft/sp-core-library';

import { IApprovedCDNs, IFetchInfo, ITagInfo, ISecurityProfile, SourceSecurityRank, 
  IApprovedFileType, ICDNCheck , SourceSecurityRankColor, SourceSecurityRankBackG, SourceSecurityRankIcons, approvedFileTypes } from './Security20/interface';

import { IAdvancedSecurityProfile } from './Security20/interface';
 
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

  //Secure Script Props
  cdnMode: ICDNMode;
  cdnValid: boolean;
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

}

export interface ISecureScript7State {

  lastStateChange: string;
  showDevHeader: boolean;
  isSiteAdmin: boolean;

  showOriginalHtml: boolean;
  showApprovedLocations: boolean;
  showRawHTML: boolean;
  fullBlockedHeight: boolean;
  toggleTag: 'files' | 'tags';

  selectedKey: ICDNCheck | IApprovedFileType | 'raw';

}
