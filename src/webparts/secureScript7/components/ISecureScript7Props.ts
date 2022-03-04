import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IWebpartBannerProps, } from '@mikezimm/npmfunctions/dist/HelpPanel/onNpm/bannerProps';

import { IApprovedCDNs, IFetchInfo, ITagInfo, approvedFileTypes, approvedExternalCDNs, approvedSites, ISecurityProfile, SourceSecurityRank, 
  IApprovedFileType, ICDNCheck , warnExternalCDNs, blockExternalCDNs, SourceSecurityRankColor, SourceSecurityRankBackG, SourceSecurityRankIcons } from './ApprovedLibraries';

export type ICDNMode = 'Webs' | 'Libraries';

export interface ISecureScript7Props {

  //OOTB Props
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;

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
  // context: WebPartContext;

  domElement: any;
  fetchInfo: IFetchInfo;
  showCodeIcon: boolean;

}

export interface ISecureScript7State {

  lastStateChange: string;
  showDevHeader: boolean;
  isSiteAdmin: boolean;

  showOriginalHtml: boolean;
  showApprovedLocations: boolean;
  showRawHTML: boolean;
  toggleTag: 'file' | 'tag';

  selectedKey: ICDNCheck | IApprovedFileType | 'raw';

}
