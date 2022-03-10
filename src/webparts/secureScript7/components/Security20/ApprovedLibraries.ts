import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN, IApprovedCDNs, FetchLibString, ISecurityProfile, ICDNCheck, IFileTypeCDN } from './interface';

/**
 * This const sets the overall thresholds for blocking individual file types.
 * This will let you block JS files from anywhere except SecureCDN yet allow images from anywhere on the internet
 */
export const SecureProfile  : ISecurityProfile = {
    cssWarn: 'ExtWarn',
    cssBlock: 'ExtBlock',
    jsWarn: '',
    jsBlock: 'Local',
    imgWarn: 'ExtWarn',
    imgBlock: 'ExtBlock',
    linkWarn: 'WWW',
    linkBlock: 'ExtBlock',
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
    approved: ['https://js.approveme.com/'],
    warn: ['https://js.warnme.com/'],
    block: ['https://js.blockme.com/'],
};

export const cssCDNs : IFileTypeCDN = {
  approved: ['https://css.approveme.com/'],
  warn: ['https://css.warnme.com/'],
  block: ['https://css.blockme.com/'],
};

export const imgCDNs : IFileTypeCDN = {
  approved: ['https://img.approveme.com/'],
  warn: ['https://img.warnme.com/'],
  block: ['https://img.blockme.com/'],
};

export const linkCDNs : IFileTypeCDN = {
  approved: ['https://link.approveme.com/', 'https://msdn.microsoft.com/'],
  warn: ['https://link.warnme.com/'],
  block: ['https://link.blockme.com/'],
};

//Currently only html from SecureCDN is valid.  This is just protecting for possible need
export const htmlCDNs : IFileTypeCDN = {
  approved: ['https://html.approveme.com/'],
  warn: ['https://html.warnme.com/'],
  block: ['https://html.blockme.com/'],
};

