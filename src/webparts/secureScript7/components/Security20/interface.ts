
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
  }
  
  export interface IFetchInfo {
        snippet: string;
        selectedKey: ICDNCheck | IApprovedFileType | 'raw';
        errorHTML: string;
        js: ITagInfo[];
        css: ITagInfo[];
        img:ITagInfo[];
        links:ITagInfo[];
        html:ITagInfo[];
        preFetchTime: number;
        postFetchTime: number;
        postRegexTime: number;
        fetchTime: number;
        regexTime: number;
        nothing:ITagInfo[];
        secure:ITagInfo[];
        tenant:ITagInfo[];
        extApp:ITagInfo[];
        warns:ITagInfo[];
        blocks:ITagInfo[];
        www:ITagInfo[];
  }
  
  export type ICDNCheck = 'Nothing' | 'SecureCDN' | 'Tenant' | 'ExternalApproved' | 'ExternalWarn' | 'ExternalBlock' | 'WWW' | 'TBD';
  
  //This tells the rank order from Highest security to lowest
  export const SourceSecurityRank:   ICDNCheck[] = [ 'Nothing' ,     'SecureCDN' ,          'Tenant' ,          'ExternalApproved' ,  'ExternalWarn', 'WWW' ,  'ExternalBlock' ];
  export const SourceSecurityRankIcons: string[] = [ 'CircleShape' , 'BlockedSiteSolid12' , 'SharepointLogo' ,  'GlobeFavorite' ,     'ErrorBadge',   'Globe' ,       'BlockedSiteSolid12' ];
  export const SourceSecurityRankColor: string[] = [ 'black' ,       'green' ,              'blue' ,            'purple' ,            'black',        'black' ,  'red' ];
  export const SourceSecurityRankBackG: string[] = [ 'lightgray' ,   'white' ,              'white' ,           'white' ,             'yellow',       'white' ,  'yellow' ];
  
  export interface ISecurityProfile {
    cssWarn: ICDNCheck;
    cssBlock: ICDNCheck;
    jsWarn: ICDNCheck;
    jsBlock: ICDNCheck;
    imgWarn: ICDNCheck;
    imgBlock: ICDNCheck;
  
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