import {
  IPropertyPaneDropdownOption,
} from '@microsoft/sp-property-pane';

export interface IApprovedCDNs extends IPropertyPaneDropdownOption {

  key: string;
  siteRelativeURL: string;
  library: string;
  text: string;
  subsites?: boolean;

}

export const approvedLibraries : IApprovedCDNs[] = [
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