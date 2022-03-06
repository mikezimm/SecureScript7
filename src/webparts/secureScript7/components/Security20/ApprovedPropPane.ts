
import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN, IApprovedCDNs, FetchLibString, ISecurityProfile, ICDNCheck } from './interface';

/**
 * This came from CherryPicked webpart to initially load the property pane.
 */
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