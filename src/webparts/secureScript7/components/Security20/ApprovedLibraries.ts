import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN, IApprovedCDNs, FetchLibString, ISecurityProfile, ICDNCheck, IFileTypeCDN } from './interface';

/**
 * This const sets the overall thresholds for blocking individual file types.
 * This will let you block JS files from anywhere except SecureCDN yet allow images from anywhere on the internet
 */
export const SecureProfile  : ISecurityProfile = {
    cssWarn: 'WWW',
    cssBlock: 'Block',
    jsWarn: '',
    jsBlock: 'Local',
    imgWarn: 'WWW',
    imgBlock: 'Block',
    linkWarn: 'WWW',
    linkBlock: 'Block',
    htmlWarn: 'Nothing',
    htmBlock: 'Tenant',
  };

  /**
   * This should be your SecureCDN in your tenant.  Only 1 has been tested.
   */
export const approvedSites : IApprovedCDNs[] = [
  {
    key: TenantCDN,
    siteRelativeURL: TenantCDN,
    library: FetchLibString,
    text: "Tenant CDN",
    subsites: true,
  },
];


/**
 * These external sites are approved for all types
 */
export const masterApprovedExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END

  `${window.location.origin}${TenantCDN}/`,
  '/_layouts/',
  'https://code.jquery/',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesom/',
];

/**
 * These external sites are warned for all types
 */
export const masterWarnExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
  'https://warnme.now.com/',
];

/**
 * These external sites are blocked for all types
 */
export const masterBlockExternalCDNs: string[] = [
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
    //MAKE SURE DOES HAVE SLASH AT END
  'https://blockme.now.com/',
];

export const jsCDNs : IFileTypeCDN = {
  Approved: ['https://js.approveme.com/','https://shell.cdn.office.net/shellux/','https://res-1.cdn.office.net:443/files/sp-client/','https://res.cdn.office.net/midgard/versionless/'],
  Warn: ['https://js.warnme.com/'],
  Block: ['https://js.blockme.com/'],
};

export const cssCDNs : IFileTypeCDN = {
  Approved: ['https://css.approveme.com/'],
  Warn: ['https://css.warnme.com/'],
  Block: ['https://css.blockme.com/'],
};

export const imgCDNs : IFileTypeCDN = {
  Approved: ['https://img.approveme.com/'],
  Warn: ['https://img.warnme.com/'],
  Block: ['https://img.blockme.com/'],
};

export const linkCDNs : IFileTypeCDN = {
  Approved: ['https://link.approveme.com/', 'https://msdn.microsoft.com/'],
  Warn: ['https://link.warnme.com/'],
  Block: ['https://link.blockme.com/'],
};

//Currently only html from SecureCDN is valid.  This is just protecting for possible need
export const htmlCDNs : IFileTypeCDN = {
  Approved: ['https://html.approveme.com/'],
  Warn: ['https://html.warnme.com/'],
  Block: ['https://html.blockme.com/'],
};

