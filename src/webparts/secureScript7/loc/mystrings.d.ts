declare interface ISecureScript7WebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;

  LibraryPickerLabel: string;
  LibraryItemPickerLabel: string;

  // 1 - Analytics options
  analyticsWeb: string;
  analyticsList: string;
  
}

declare module 'SecureScript7WebPartStrings' {
  const strings: ISecureScript7WebPartStrings;
  export = strings;
}
