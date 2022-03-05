import {
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-property-pane';


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

//Issue #7
//NOTE:  ALWAYS Have approvedFileTypes in lower case for filtering purposes
export type IApprovedFileType = 'html' | 'css' | 'js' | 'img' | 'raw' ;
export const approvedFileTypes : IApprovedFileType[] = [ 'html', 'css', 'js', 'img' ];

//Added from issue #15
export const approvedExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END

  `${window.location.origin}/sites/SecureCDN/`,
  `https://mcclickster.sharepoint.com/sites/`,
  `https://autoliv.sharepoint.com/sites/`,
  // `https://mcclickster.sharepoint.com/sites/SecureCDN/`,
  // `https://autoliv.sharepoint.com/sites/SecureCDN/`,
  '/_layouts/',
  'https://code.jquery',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesom/',
];

export const warnExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
  'https://warnme.now.com/',
];

export const blockExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
  'https://blockme.now.com/',
];

export interface IApprovedCDNs extends IPropertyPaneDropdownOption {

  key: string;
  siteRelativeURL: string;
  library: string;
  text: string;
  subsites?: boolean;

}

export const approvedLibraries : IApprovedCDNs[] = [
  //MAKE SURE siteRelativeURL starts with /sites/ and DOES NOT have slash at end
  {
    key: "/sites/PublicCDN/SiteAssets",
    siteRelativeURL: "/sites/PublicCDN",
    library: "Site Assets",
    text: "Public CDN Site Assets"
  },
  {
    key: "/sites/PublicCDN/Shared%20Documents",
    siteRelativeURL: "/sites/PublicCDN",
    library: "Documents",
    text: "Public CDN Documents"
  },
  {
    key: "/sites/PrivateCDN/SiteAssets",
    siteRelativeURL: "/sites/PrivateCDN",
    library: "Site Assets",
    text: "Private CDN Site Assets"
  },
  {
    key: "/sites/SecureCDN/SiteAssets",
    siteRelativeURL: "/sites/SecureCDN",
    library: "Site Assets",
    text: "SecureCDN Site Assets"
  },

];

//approvedSites  FetchLibString

export const FetchLibString = 'FetchLibraries';

export const approvedSites : IApprovedCDNs[] = [
  {
    key: "/sites/SecureCDN",
    siteRelativeURL: "/sites/SecureCDN",
    library: FetchLibString,
    text: "Tenant CDN",
    subsites: true,
  },
];