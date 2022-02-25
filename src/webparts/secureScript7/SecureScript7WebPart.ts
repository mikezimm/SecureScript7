import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';



import { createFPSWindowProps, initializeFPSSection, initializeFPSPage, webpartInstance, initializeMinimalStyle } from '@mikezimm/npmfunctions/dist/Services/DOM/FPSDocument';

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

  public render(): void {

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
      panelTitle: 'Pivot Tiles webpart - Automated links and tiles',
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

  let bannerSetup = buildBannerProps( this.properties , buildBannerSettings );
  errMessage = bannerSetup.errMessage;
  let bannerProps = bannerSetup.bannerProps;
  let expandoErrorObj = bannerSetup.errorObjArray;




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
        pageContext: this.context.pageContext,
        context: this.context,
        urlVars: getUrlVars(),

        //Banner related props
        errMessage: 'any',
        bannerProps: bannerProps,



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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
