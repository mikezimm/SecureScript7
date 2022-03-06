import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN, IApprovedCDNs, FetchLibString } from './interface';

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



export const approvedSites : IApprovedCDNs[] = [
  {
    key: TenantCDN,
    siteRelativeURL: TenantCDN,
    library: FetchLibString,
    text: "Tenant CDN",
    subsites: true,
  },
];