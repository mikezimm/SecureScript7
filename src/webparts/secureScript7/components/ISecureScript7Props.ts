import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from "@microsoft/sp-webpart-base";

import { IBuildBannerSettings , buildBannerProps, IMinWPBannerProps } from '../BannerSetup';
import { IWebpartBannerProps, } from './HelpPanel/banner/onNpm/bannerProps';

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

}

export interface ISecureScript7State {

  lastStateChange: string;
  showDevHeader: boolean;
  isSiteAdmin: boolean;

}
