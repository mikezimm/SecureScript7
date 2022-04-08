
import {
    IPropertyPaneDropdownOption,
  } from '@microsoft/sp-property-pane';

import { IPerformanceOp, ILoadPerformanceSS7, IHistoryPerformance } from '../Performance/IPerformance';


export const FetchLibString = 'FetchLibraries';
export const TenantCDN = '/sites/SecureCDN';

  /***
 *    d888888b  .d8b.   d888b  .d8888. 
 *    `~~88~~' d8' `8b 88' Y8b 88'  YP 
 *       88    88ooo88 88      `8bo.   
 *       88    88~~~88 88  ooo   `Y8b. 
 *       88    88   88 88. ~8~ db   8D 
 *       YP    YP   YP  Y888P  `8888Y' 
 *                                     
 *                                     
 */


export interface ITagInfo {
    tag: string;
    file: string;
    fileOriginal: string;
    fileStd: string;
    type: IApprovedFileType;
    regex: string;
    status: string;
    styleTag: string;
    icon: string;
    color: string;
    background: string;
    rank: number;
    label: string;
    fileStyle: IPolicyFlagStyle;
    flagLevel: IPolicyFlagLevel;
    location: ICDNCheck;
    policyFlags: IPolicyFlag;
  }

  export interface IFileTypeCDN {
      Approved: string[];
      Warn: string[];
      Block: string[];
  }

  export type IPolicyFlagLevel = 'Warn' | 'Block' | 'Verify' | 'none';

  export interface IPolicyFlagStyle {
    color: string;
    background: string;
    fontWeight: string;
    fontSize: string;
  }

  export interface IPolicyFlagStyles {
    Block: IPolicyFlagStyle;
    Warn: IPolicyFlagStyle;
    Verify: IPolicyFlagStyle;
    none: IPolicyFlagStyle;
  }


  export const PolicyFlagStyles: IPolicyFlagStyles = {
    Block: {color: 'crimson', background: 'yellow', fontWeight: '', fontSize: '' },
    Warn: {color: 'darkviolet', background: 'LightYellow', fontWeight: '', fontSize: '' },
    Verify: {color: 'blue', background: 'AliceBlue', fontWeight: '', fontSize: '' },
    none: {color: 'green', background: '#e9ffc7', fontWeight: '', fontSize: '' },
  };

  export interface IPolicyFlags {
    Block: IPolicyFlag[];
    Warn: IPolicyFlag[];
    Verify: IPolicyFlag[];
    none: IPolicyFlag[];
  }

  export type IVerifyType = '+=' | '+' | '-' | '+-' | '++'  | '=' | 'length' ;

  export interface IPolicyFlag {
    level: IPolicyFlagLevel;
    Verify: IVerifyType[];
    type: IApprovedFileType;
    cdn: string;
    key: string;
  }

  /***
 *    d88888b d88888b d888888b  .o88b. db   db      d888888b d8b   db d88888b  .d88b.  
 *    88'     88'     `~~88~~' d8P  Y8 88   88        `88'   888o  88 88'     .8P  Y8. 
 *    88ooo   88ooooo    88    8P      88ooo88         88    88V8o 88 88ooo   88    88 
 *    88~~~   88~~~~~    88    8b      88~~~88         88    88 V8o88 88~~~   88    88 
 *    88      88.        88    Y8b  d8 88   88        .88.   88  V888 88      `8b  d8' 
 *    YP      Y88888P    YP     `Y88P' YP   YP      Y888888P VP   V8P YP       `Y88P'  
 *                                                                                     
 *                                                                                     
 */

  export interface IFetchInfo {
        snippet: string;
        selectedKey: ICDNCheck | IApprovedFileType | 'raw';
        errorHTML: string;
        js: ITagInfo[];
        css: ITagInfo[];
        img:ITagInfo[];
        link:ITagInfo[];
        html:ITagInfo[];
        preFetchTime: number;
        postFetchTime: number;
        postRegexTime: number;
        fetchTime: number;
        regexTime: number;
        Nothing:ITagInfo[];
        Secure:ITagInfo[];
        Local:ITagInfo[];
        Tenant:ITagInfo[];
        Approved:ITagInfo[];
        Warn:ITagInfo[];
        Block:ITagInfo[];
        Verify:ITagInfo[];
        www:ITagInfo[];
        policyFlags: IPolicyFlags;
        securityProfile: IAdvancedSecurityProfile;
        summary: IFetchSummaryStats;
        performance: ILoadPerformanceSS7;
  }

  export interface IFetchSummaryStats {

    performance: {
      fetchTime: number;
      regexTime: number;
    };

    files: {
      js: number;
      css: number;
      img: number;
      html: number;
    };

    locations: {
      Nothing:number;
      Secure:number;
      Local:number;
      Tenant:number;
      Approved:number;
      Warn:number;
      Block:number;
      Verify:number;
      www:number;
    };

    flags: {
      Block: number;
      Warn: number;
      Verify: number;
    };

  }

  /***
 *    .d8888. d88888b  .o88b. db    db d8888b. d888888b d888888b db    db 
 *    88'  YP 88'     d8P  Y8 88    88 88  `8D   `88'   `~~88~~' `8b  d8' 
 *    `8bo.   88ooooo 8P      88    88 88oobY'    88       88     `8bd8'  
 *      `Y8b. 88~~~~~ 8b      88    88 88`8b      88       88       88    
 *    db   8D 88.     Y8b  d8 88b  d88 88 `88.   .88.      88       88    
 *    `8888Y' Y88888P  `Y88P' ~Y8888P' 88   YD Y888888P    YP       YP    
 *                                                                        
 *                                                                        
 */

   export interface IThrottleAnalytics {
    serverRequestPath: string; // context.pageContext.site.serverRequestPath => "/sites/SecureScriptTesting/Gulpy/SitePages/Stock,Nothing,Block Samples - DO NOT CHANGE.aspx"
    capture: number; //% as whole number to capture analytics
  }

   export interface IApprovedCDNs extends IPropertyPaneDropdownOption {

    key: string;
    siteRelativeURL: string;
    library: string;
    text: string;
    subsites?: boolean;
  }

  export type ICDNCheck = 'Nothing' | 'SecureCDN' | 'Local' | 'Tenant' | 'Approved' | 'Warn' | 'Block' | 'Verify' | 'WWW' | 'TBD' | '';

  // //This tells the rank order from Highest security to lowest
  // export const SourceSecurityRank:   ICDNCheck[] = [ 'Nothing' ,     'SecureCDN' ,          'Local',            'Tenant' ,          'Approved' ,  'Warn',   'Verify',     'WWW' ,  'Block' ];
  // export const SourceSecurityRankIcons: string[] = [ 'CircleShape' , 'BlockedSiteSolid12' , 'SharepointLogo',   'SharepointLogo' ,  'GlobeFavorite' ,     'ErrorBadge',     'TagUnknown', 'Globe' ,       'BlockedSiteSolid12' ];
  // export const SourceSecurityRankColor: string[] = [ 'black' ,       'green' ,              'blue',             'blue' ,            'purple' ,            'black',          'black',      'black' ,  'red' ];
  // export const SourceSecurityRankBackG: string[] = [ 'lightgray' ,   'white' ,              'white',            'white' ,           'white' ,             'yellow',         'yellow',     'white' ,  'yellow' ];

  export interface ISourceInfo {
    name: ICDNCheck;
    icon: string;
    color: string;
    backg: string;
  }

  export const SourceNothing: ISourceInfo = { name: 'Nothing',      icon: 'CircleShape' ,         color: 'black',   backg: 'lightgray' };
  export const SourceSecure:  ISourceInfo = { name: 'SecureCDN',    icon: 'Encryption' ,  color: 'green',   backg: 'white' };
  export const SourceLocal:   ISourceInfo = { name: 'Local',        icon: 'SharepointLogo' ,      color: 'blue',    backg: 'white' };
  export const SourceTenant:  ISourceInfo = { name: 'Tenant',       icon: 'SharepointLogo' ,      color: 'blue',    backg: 'white' };
  export const SourceExtApp:  ISourceInfo = { name: 'Approved', icon: 'GlobeFavorite' ,   color: 'purple',  backg: 'white' };
  export const SourceWarn: ISourceInfo = { name: 'Warn', icon: 'ErrorBadge' ,          color: 'black',   backg: 'yellow' };
  export const SourceVerify:  ISourceInfo = { name: 'Verify',       icon: 'TagUnknown' ,          color: 'black',   backg: 'yellow' };
  export const SourceWWW:     ISourceInfo = { name: 'WWW',          icon: 'Globe' ,               color: 'black',   backg: 'white' };
  export const SourceBlock:   ISourceInfo = { name: 'Block', icon: 'BlockedSiteSolid12' , color: 'red',     backg: 'yellow' };

  export const SourceInfo : ISourceRank = {
    ranks: [
      SourceNothing,
      SourceSecure,
      SourceLocal,
      SourceTenant,
      SourceExtApp,
      SourceWWW,
      SourceVerify,
      SourceWarn,
      SourceBlock,
    ]
  };

  export interface ISourceRank {
    ranks: ISourceInfo[];
  }

  export interface ISecurityProfile {
    cssWarn: ICDNCheck;
    cssBlock: ICDNCheck;
    jsWarn: ICDNCheck;
    jsBlock: ICDNCheck;
    imgWarn: ICDNCheck;
    imgBlock: ICDNCheck;
    linkWarn: ICDNCheck;
    linkBlock: ICDNCheck;
    htmlWarn: ICDNCheck;
    htmlBlock: ICDNCheck;

  }

  /**
   * This interface defines the structure to summarize each file type
   * counts:  number of files in each category
   * cdns:  cdns listed for specific file type
   */
  export interface IFileTypeSecurity {
    icon: string;
    ext: IApprovedFileType;
    title: string;
    text1?: string;
    text2?: string;
    counts: {
      Nothing: number;
      SecureCDN: number;
      Local: number;
      Tenant: number;
      Approved: number;
      Verify: number;
      Warn: number;
      WWW: number;
      Block: number;
    };
    level: {
      Warn: ICDNCheck;
      Block: ICDNCheck;
    };
    styles: IPolicyFlagStyle[];
    flagLevels: IPolicyFlagLevel[];
    cdns: {
      Approved: string[];
      Warn: string[];
      Block: string[];
    };
  }
  
  
  export interface IAdvancedSecurityProfile {
    sort: string[];
    all: IFileTypeSecurity;
    js: IFileTypeSecurity;
    css: IFileTypeSecurity;
    html: IFileTypeSecurity;
    img: IFileTypeSecurity;
    link: IFileTypeSecurity;
  }
  
  
  //Issue #7
  //NOTE:  ALWAYS Have approvedFileTypes in lower case for filtering purposes
  export type IApprovedFileType = 'html' | 'css' | 'js' | 'img' | 'link' | 'raw' | 'all' ;
  export const approvedFileTypes : IApprovedFileType[] = [ 'html', 'css', 'js', 'img' , 'link' ];

  export const approvedFilePickerTypes : IApprovedFileType[] = [ 'html', 'js' ]; 