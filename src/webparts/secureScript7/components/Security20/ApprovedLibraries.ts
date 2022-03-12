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
 * NOTES ABOUT
 *
 * FOR BLOCKS AND WARNS - do NOT end with slashes
 *
 * Always try to NOT have a slash at the end of a cdn if it's Block or Warn so it captures all cases.
 * If you include a slash at the end and the script has something like host.name.com / (with a space, it would not catch it)
 *
 *
 *
 * FOR APPROVED Locations - do opposite - End with slashes (except SPO Sites)
 *
 * Always TRY TO have a slash at the end of a cdn if it's approved 
 * unless it is a SharePoint site, in which
 * NOTE HOWEVER that if you include a slash at the end, then it could flag some autmoated urls that do not have slash at the end (like site links)
 */


/**
 * These external sites are approved for all types
 */
export const masterApprovedExternalCDNs: string[] = [
  `${window.location.origin}${TenantCDN}/`,
  '/_layouts/',
  'https://code.jquery/',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesom/',
];

/**
 * These external sites are warned for all types
 */
export const masterWarnExternalCDNs: string[] = [
  'https://warnme.now.com',
];

/**
 * These external sites are blocked for all types
 */
export const masterBlockExternalCDNs: string[] = [
  'https://blockme.now.com',
];

export const jsCDNs : IFileTypeCDN = {
  Approved: [
  'https://js.approveme.com/',
  'https://localhost:4321/dist/', //Used for gulp serve spfx webparts
  'https://localhost:4321/temp/', //Used for gulp serve spfx webparts
  '/sites/Apps/ClientSideAssets/', //OOTB App Catalog for webparts
  '/sites/Catalog/ClientSideAssets/', //ALV App Catalog for webparts
  'https://shell.cdn.office.net/shellux/',
  'https://res-1.cdn.office.net:443/files/sp-client/',
  'https://res.cdn.office.net/midgard/versionless/',
  'https://s3.tradingview.com',
  'https://scripts.teamtailor-cdn.com/widgets/production/', //Team Taylor Job Postings
],

  Warn: ['https://js.warnme.com', ],
  Block: ['https://js.blockme.com', ],
};

export const cssCDNs : IFileTypeCDN = {
  Approved: ['https://css.approveme.com'],
  Warn: ['https://css.warnme.com'],
  Block: ['https://css.blockme.com'],
};

export const imgCDNs : IFileTypeCDN = {
  Approved: ['https://img.approveme.com'],
  Warn: ['https://img.warnme.com'],
  Block: ['https://img.blockme.com'],
};

export const linkCDNs : IFileTypeCDN = {
  Approved: ['https://link.approveme.com', 'https://msdn.microsoft.com' ],
  Warn: [
    'https://link.warnme.com',
    'https://mcclickster.sharepoint.com/sites/SecureScriptTesting/GulpY' ],
  Block: [
    'https://link.blockme.com',
    'https://mcclickster.sharepoint.com/sites/PivotHub' ],
};

//Currently only html from SecureCDN is valid.  This is just protecting for possible need
export const htmlCDNs : IFileTypeCDN = {
  Approved: ['https://html.approveme.com'],
  Warn: ['https://html.warnme.com'],
  Block: ['https://html.blockme.com'],
};

