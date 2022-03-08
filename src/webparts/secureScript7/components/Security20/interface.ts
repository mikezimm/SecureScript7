
import {
    IPropertyPaneDropdownOption,
  } from '@microsoft/sp-property-pane';


export const FetchLibString = 'FetchLibraries';
export const TenantCDN = '/sites/SecureCDN';

export interface IApprovedCDNs extends IPropertyPaneDropdownOption {

    key: string;
    siteRelativeURL: string;
    library: string;
    text: string;
    subsites?: boolean;
  }

export interface ITagInfo {
    tag: string;
    file: string;
    fileOriginal: string;
    type: IApprovedFileType;
    status: string;
    styleTag: string;
    icon: string;
    color: string;
    background: string;
    rank: number;
    label: string;
    eleStyle: string;
    location: ICDNCheck;
    policyFlags: IPolicyFlag;
  }

  export interface IFileTypeCDN {
      approved: string[];
      warn: string[];
      block: string[];
  }

  export type IPolicyFlagLevel = 'warn' | 'block' | 'verify' | 'none';

  export interface IPolicyFlags {
    block: IPolicyFlag[];
    warn: IPolicyFlag[];
    verify: IPolicyFlag[];
    none: IPolicyFlag[];
  }

  export type IVerifyType = '+=' | '+' | '-' | '+-' | '++'  | '=' | 'length' ;

  export interface IPolicyFlag {
    level: IPolicyFlagLevel;
    verify: IVerifyType[];
    type: IApprovedFileType;
    cdn: string;
    key: string;
  }

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
        nothing:ITagInfo[];
        secure:ITagInfo[];
        local:ITagInfo[];
        tenant:ITagInfo[];
        extApp:ITagInfo[];
        warns:ITagInfo[];
        blocks:ITagInfo[];
        verify:ITagInfo[];
        www:ITagInfo[];
        policyFlags: IPolicyFlags;
  }

  export type ICDNCheck = 'Nothing' | 'SecureCDN' | 'Local' | 'Tenant' | 'ExternalApproved' | 'ExternalWarn' | 'ExternalBlock' | 'Verify' | 'WWW' | 'TBD';

  //This tells the rank order from Highest security to lowest
  export const SourceSecurityRank:   ICDNCheck[] = [ 'Nothing' ,     'SecureCDN' ,          'Local',            'Tenant' ,          'ExternalApproved' ,  'ExternalWarn',   'Verify',     'WWW' ,  'ExternalBlock' ];
  export const SourceSecurityRankIcons: string[] = [ 'CircleShape' , 'BlockedSiteSolid12' , 'SharepointLogo',   'SharepointLogo' ,  'GlobeFavorite' ,     'ErrorBadge',     'TagUnknown', 'Globe' ,       'BlockedSiteSolid12' ];
  export const SourceSecurityRankColor: string[] = [ 'black' ,       'green' ,              'blue',             'blue' ,            'purple' ,            'black',          'black',      'black' ,  'red' ];
  export const SourceSecurityRankBackG: string[] = [ 'lightgray' ,   'white' ,              'white',            'white' ,           'white' ,             'yellow',         'yellow',     'white' ,  'yellow' ];

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
    htmBlock: ICDNCheck;

  }

  /**
   * This interface defines the structure to summarize each file type
   * counts:  number of files in each category
   * cdns:  cdns listed for specific file type
   */
  export interface IFileTypeSecurity {
    icon: string;
    ext: string;
    title: string;
    text1?: string;
    text2?: string;
    counts: {
      Nothing: number;
      SecureCDN: number;
      Tenant: number;
      ExternalApproved: number;
      ExternalWarn: number;
      WWW: number;
      ExternalBlock: number;
    };
    level: {
      warn: ICDNCheck;
      block: ICDNCheck;
    };
    cdns: {
      approved: string[];
      warn: string[];
      block: string[];
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
  export type IApprovedFileType = 'html' | 'css' | 'js' | 'img' | 'link' | 'raw' ;
  export const approvedFileTypes : IApprovedFileType[] = [ 'html', 'css', 'js', 'img' , 'link' ];