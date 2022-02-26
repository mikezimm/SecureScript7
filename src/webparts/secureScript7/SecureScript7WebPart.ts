import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneDropdownProps,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';


import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';

import { FPSOptionsGroupBasic, FPSBanner2Group, FPSOptionsGroupAdvanced } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsGroup2';
import { FPSOptionsExpando,  } from '@mikezimm/npmfunctions/dist/Services/PropPane/FPSOptionsExpando'; //expandAudienceChoicesAll

import { WebPartInfoGroup, JSON_Edit_Link } from '@mikezimm/npmfunctions/dist/Services/PropPane/zReusablePropPane';

import * as links from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { importProps, } from '@mikezimm/npmfunctions/dist/Services/PropPane/ImportFunctions';

import { IBuildBannerSettings , buildBannerProps, IMinWPBannerProps } from './BannerSetup';

import { buildExportProps } from './BuildExportProps';

import { setExpandoRamicMode } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSExpandoramic';
import { getUrlVars } from '@mikezimm/npmfunctions/dist/Services/Logging/LogFunctions';

import * as strings from 'SecureScript7WebPartStrings';
import SecureScript7 from './components/SecureScript7';
import { ISecureScript7WebPartProps } from './ISecureScript7WebPartProps';
import { ISecureScript7Props } from './components/ISecureScript7Props';


import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { approvedLibraries } from './components/ApprovedLibraries';

// import { fetchSnippet } from './loadDangerous';
import { fetchSnippetMike } from './components/FetchCode';
import { executeScript } from './components/EvalScripts';

require('../../services/propPane/GrayPropPaneAccordions.css');


export default class SecureScript7WebPart extends BaseClientSideWebPart<ISecureScript7WebPartProps> {


  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  private wpInstanceID: any = webpartInstance( 'SS7' );

  //For FPS options
  private fpsPageDone: boolean = false;
  private fpsPageArray: any[] = null;
  private minQuickLaunch: boolean = false;
  private minHideHeader: boolean = false;
  private minHideToolbar: boolean = false;
  private allSectionMargin: number = -999;
  private allSectionMaxWidth: number = -999;
  private showPageHeader: boolean = null;
  private urlParameters: any = {};

  //For FPS Banner
  private forceBanner = true ;
  private modifyBannerTitle = true ;
  private modifyBannerStyle = true ;

  private  expandoDefault = false;

  private expandoErrorObj = {

  };

  // Only content from the approved libraries can be selected
  // Copied from CherryPickedCE
  private approvedLibraries = approvedLibraries;
  private snippet: string = '';


  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit().then(_ => {
      // other init code may be present

        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        console.log('location',window.location.href);
        if ( window.location.href &&
           window.location.href.indexOf("layouts/15/workbench.aspx") > 0  ) {

          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }

          // if ( this.properties.uniqueId && this.properties.uniqueId.length > 0 ) {} else { 
          //   this.properties.uniqueId = makeid( 7 ) ;
          // }

        } 

      // sp.setup({
      //   spfxContext: this.context
      // });

      this.urlParameters = getUrlVars();

      this.expandoDefault = this.properties.expandoDefault === true && this.properties.enableExpandoramic === true ? true : false;
      if ( this.urlParameters.Mode === 'Edit' ) { this.expandoDefault = false; }
      let expandoStyle: any = {};
      try {
        expandoStyle = JSON.parse( this.properties.expandoStyle );

      } catch(e) {

      }
      let padding = this.properties.expandoPadding ? this.properties.expandoPadding : 20;
      setExpandoRamicMode( this.context.domElement, this.expandoDefault, expandoStyle,  false, false, padding );
      
      
    });
  }

  // public render(): void {
  public async render() {

    let errMessage = '';
    let errorObjArray :  any[] =[];


    /***
      *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b. 
      *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D 
      *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY' 
      *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b   
      *    88   8D 88   88 88  V888 88  V888 88.     88 `88. 
      *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD 
      *                                                      
      *                                                      
      */
    let buildBannerSettings : IBuildBannerSettings = {

      //this. related info
      context: this.context,
      clientWidth: this.domElement.clientWidth,
      exportProps: buildExportProps( this.properties, this.wpInstanceID ),

      //Webpart related info
      panelTitle: 'Secure Script 7 webpart - Script Editor with some controls',
      modifyBannerTitle: this.modifyBannerTitle,
      repoLinks: links.gitRepoPivotTilesSmall,

      //Hard-coded Banner settings on webpart itself
      forceBanner: this.forceBanner,
      earyAccess: false,
      wideToggle: true,
      expandAlert: false,
      expandConsole: true,

      //Error info
      errMessage: errMessage,
      errorObjArray: errorObjArray, //In the case of Pivot Tiles, this is manualLinks[],
      expandoErrorObj: this.expandoErrorObj,

  };

  let showTricks: any = false;
  links.trickyEmails.map( getsTricks => {
    if ( this.context.pageContext.user.loginName && this.context.pageContext.user.loginName.toLowerCase().indexOf( getsTricks ) > -1 ) { showTricks = true ; }   } ); 

  let bannerSetup = buildBannerProps( this.properties , buildBannerSettings, showTricks );
  errMessage = bannerSetup.errMessage;
  let bannerProps = bannerSetup.bannerProps;
  let expandoErrorObj = bannerSetup.errorObjArray;

  let showCodeIcon = false;

  let legacyPageContext = this.context.pageContext.legacyPageContext;

  if ( this.properties.showCodeAudience === 'Everyone' || showTricks === true ) {
    showCodeIcon = true;
  } else if ( legacyPageContext.isSiteAdmin === true ) {
    showCodeIcon = true;
  } else if ( ( legacyPageContext.hasManageWebPermissions === true || legacyPageContext.isSiteOwner === true ) && ( 
    this.properties.showCodeAudience === 'Site Owners' ) ) {
    showCodeIcon = true;

    //At some point, add for page editors but will require more thought to not slow down load.
  } else if ( legacyPageContext.isSiteAdmin === true ) {
    showCodeIcon = true;
  }

  this.snippet = await fetchSnippetMike( this.context, '', this.properties.libraryPicker, this.properties.libraryItemPicker );

    const element: React.ReactElement<ISecureScript7Props> = React.createElement(
      SecureScript7,
      {
        //OOTB Default Props
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,

        //Environement props
        // pageContext: this.context.pageContext, //This can be found in the bannerProps now
        context: this.context,
        urlVars: getUrlVars(),

        //Banner related props
        errMessage: 'any',
        bannerProps: bannerProps,

        //SecureScript props
        libraryPicker: this.properties.libraryPicker,
        libraryItemPicker: this.properties.libraryItemPicker,
        fileRelativeUrl: `${this.properties.libraryPicker}/${this.properties.libraryItemPicker}`,
        approvedLibraries: this.approvedLibraries,
        domElement: this.domElement,
        snippet: this.snippet,
        showCodeIcon: showCodeIcon,

      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }



  // Dropdown gets disabled while retrieving items asynchronously
  // Copied from CherryPickedCE
  private itemsDropdownDisabled: boolean = true;

  // Files in the selected library
  // Copied from CherryPickedCE
  private libraryItemsList: IPropertyPaneDropdownOption[];

  // Asynchronous library query
  // Copied from CherryPickedCE
  private getLibraryItemsList = (library) => {
    // Validate approved location
    const filesLocation = this.approvedLibraries.filter(loc => loc.key == library)[0];
    const filesQuery = window.location.origin + filesLocation.siteRelativeURL + "/_api/web/lists/getbytitle('" + filesLocation.library + "')/files?$select=Name";

    return this.context.spHttpClient.get(filesQuery, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => response.json())
      .then(data => data.value);
  }


  // Runs before getting the Property Pane configuration
  // Copied from CherryPickedCE
  protected onPropertyPaneConfigurationStart(): void {

    this.itemsDropdownDisabled = true;

    if (this.properties.libraryPicker)
      this.getLibraryItemsList(this.properties.libraryPicker)
        .then((files): void => {
          // store items
          this.libraryItemsList = files.map(file => { return { key: file.Name, text: file.Name }; });
          this.itemsDropdownDisabled = false;
        })
        .then(() => this.context.propertyPane.refresh());
  }

  // This API is invoked after updating the new value of the property in the property bag (Reactive mode). 
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if ((propertyPath === 'libraryPicker') && (newValue)) {
      // get previously selected item
      const previousItem: string = this.properties.libraryItemPicker;
      // reset selected item
      this.properties.libraryItemPicker = "";
      // disable item selector until new items are loaded
      this.itemsDropdownDisabled = true;
      // push new item value
      this.onPropertyPaneFieldChanged('libraryItemPicker', previousItem, this.properties.libraryItemPicker);
      // this.render();
      // refresh the item selector control by repainting the property pane
      this.context.propertyPane.refresh();

      this.getLibraryItemsList(newValue)
        .then((files): void => {

          if (files.length) {
          // store items
          this.libraryItemsList = files.map(file => { return { key: file.Name, text: file.Name }; });
          // enable item selector
          this.itemsDropdownDisabled = false;
          // this.render();
          // refresh the item selector control by repainting the property pane
          this.context.propertyPane.refresh();
          }
        });
    }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {

    //This will be in npmFunctions > Services/PropPane/FPSOptionsExpando in next release.
    const expandAudienceChoicesAll: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {   index: 0,   key: 'Site Admins', text: "Site Admins"  },
      {   index: 1,   key: 'Site Owners', text: "Site Owners"  },
      {   index: 2,   key: 'Page Editors', text: "Page Editors"  },
      {   index: 2,   key: 'Everyone', text: "Everyone"  },
    ];

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true, //DONT FORGET THIS IF PROP PANE GROUPS DO NOT EXPAND
          groups: [
            WebPartInfoGroup( links.gitRepoPivotTiles, 'Swiss Army Knife of tiles' ),
            FPSBanner2Group( this.forceBanner , this.modifyBannerTitle, this.modifyBannerStyle, this.properties.showBanner, null, true ),
            FPSOptionsGroupBasic( false, true, true, true, this.properties.allSectionMaxWidthEnable, true, this.properties.allSectionMarginEnable, true ), // this group
            FPSOptionsExpando( this.properties.enableExpandoramic, this.properties.enableExpandoramic,null, null ),
            { groupName: 'Import Props',
            isCollapsed: true ,
            groupFields: [
              PropertyPaneTextField('fpsImportProps', {
                label: 'Import settings from another Pivot Tiles webpart',
                description: 'For complex settings, use the link below to edit as JSON Object',
                multiline: true,
              }),
              JSON_Edit_Link,
            ]}, // this group

            {
              groupName: 'Script Editor Properties',
              groupFields: [
                // // Web Part title
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // }),
                // Library Picker (approved libraries only)
                PropertyPaneDropdown('libraryPicker', {
                  label: strings.LibraryPickerLabel,
                  options: this.approvedLibraries,
                  selectedKey: this.properties.libraryPicker,

                }),
                // Cascading Library Item Picker
                PropertyPaneDropdown('libraryItemPicker', {
                  label: strings.LibraryItemPickerLabel,
                  options: this.libraryItemsList,
                  selectedKey: this.properties.libraryItemPicker,
                  disabled: this.itemsDropdownDisabled
                }),

                PropertyPaneDropdown('showCodeAudience', <IPropertyPaneDropdownProps>{
                  label: 'Show Code Audience',
                  options: expandAudienceChoicesAll,
                }),
              ]
            }

          ]
        }
      ]
    };
  }
}
