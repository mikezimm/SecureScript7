import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN, IApprovedCDNs, FetchLibString, ISecurityProfile, ICDNCheck, IFileTypeCDN, IThrottleAnalytics } from './interface';

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

// context.pageContext.site.serverRequestPath => "/sites/SecureScriptTesting/Gulpy/SitePages/Stock,Nothing,Block Samples - DO NOT CHANGE.aspx"
export const throttleAnalytics : IThrottleAnalytics[] =  [
  { capture: 10,  serverRequestPath: '',   }, //Use this to throttle view analytics on specific Urls ( must be exact urls )
];

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
  // These are INTERNAL APPROVED CDNs
  `${window.location.origin}${TenantCDN}/`,
  '/_layouts/',

  //These are EXTERNAL standard CDNS
  'https://code.jquery/',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesom/',

];

/**
 * These external sites are warned for ALL types INCLUDING JS!
 * JS Files that are not specifically blocked will be accepted but with 'WARN' 
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

  //This is just for TESTING specific case
  'https://js.approveme.com/',

  //These are all spfx related cdns and references
  'https://localhost:4321/dist/', //Used for gulp serve spfx webparts
  'https://localhost:4321/temp/', //Used for gulp serve spfx webparts
  '/sites/Apps/ClientSideAssets/', //OOTB App Catalog for webparts
  '/sites/Catalog/ClientSideAssets/', //ALV App Catalog for webparts

  //These are all MSFT CDNs found during testing entire page
  'https://shell.cdn.office.net/shellux/', //Found when looking at entire page - MSFT cdn
  'https://res.cdn.office.net/midgard/versionless/', //Found when looking at entire page - MSFT cdn
  'https://res-1.cdn.office.net/midgard/versionless/', //Found when looking at entire page
  'https://res-1.cdn.office.net:443/files/sp-client/', //Found when looking at entire page - MSFT cdn
  'https://r4.res.office365.com/footprint/', //Found when looking at entire page - MSFT cdn
  'https://statica.akamai.odsp.cdn.office.net/bld/', //Found when looking at entire page (but needs to inspect page twice to see )


  //These are specific approved 3rd party JS files
  'https://scripts.teamtailor-cdn.com/widgets/production/', //Team Taylor Job Postings

  //These are offcial sample js files
  'https://s3.tradingview.com',

],

  Warn: [
    //This is just for TESTING specific case
    'https://js.warnme.com',

],
  Block: [
    //This is just for TESTING specific case
    'https://js.blockme.com',

 ],
};

export const cssCDNs : IFileTypeCDN = {
  Approved: [
    //This is just for TESTING specific case
    'https://css.approveme.com'
  ],
  Warn: [
    //This is just for TESTING specific case
    'https://css.warnme.com'
  ],
  Block: [
    //This is just for TESTING specific case
    'https://css.blockme.com'
],
};

export const imgCDNs : IFileTypeCDN = {
  Approved: [
    //This is just for TESTING specific case
    'https://img.approveme.com'
  ],
  Warn: [
    //This is just for TESTING specific case
    'https://img.warnme.com'
  ],
  Block: [
    //This is just for TESTING specific case
    'https://img.blockme.com'
  ],
  };

export const linkCDNs : IFileTypeCDN = {
  Approved: [
    //This is just for TESTING specific case
    'https://link.approveme.com', 
    
    //This is official MSFT Docs links
    'https://msdn.microsoft.com' ,

    //These are official corporate external links
    'https://api.teamtailor.com/v1/jobs', //Team Taylor Job Postings
    'https://career.autoliv.com', //Team Taylor Job Postings
  
  ],
  Warn: [
    //This is just for TESTING specific case
    'https://link.warnme.com',
    'https://mcclickster.sharepoint.com/sites/SecureScriptTesting/GulpY' ],
  Block: [
    'https://link.blockme.com',
    '/sites/PivotHub' ],
};

//Currently only html from SecureCDN is valid.  This is just protecting for possible need
export const htmlCDNs : IFileTypeCDN = {
  Approved: ['https://html.approveme.com'],
  Warn: ['https://html.warnme.com'],
  Block: ['https://html.blockme.com'],
};

