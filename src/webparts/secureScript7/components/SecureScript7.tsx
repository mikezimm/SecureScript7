import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import styles from './SecureScript7.module.scss';

import { ISecureScript7Props, ISecureScript7State, IScope } from './ISecureScript7Props';
import { escape } from '@microsoft/sp-lodash-subset';

import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { Panel, IPanelProps, PanelType } from 'office-ui-fabric-react/lib/Panel';

import { Dialog, DialogFooter, DialogType, DialogContent } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize, } from 'office-ui-fabric-react/lib/Spinner';

import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
// import { ISearchQuery, SearchResults, ISearchResult } from "@pnp/sp/search";

import ReactJson from "react-json-view";

import WebpartBanner from "./HelpPanel/banner/onLocal/component";
import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults";
import { _LinkIsValid, _LinkStatus } from "@mikezimm/npmfunctions/dist/Links/AllLinks";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { IMyBigDialogProps, buildConfirmDialogBig } from "@mikezimm/npmfunctions/dist/Elements/dialogBox";

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { approvedSites, SecureProfile, } from './Security20/ApprovedLibraries';

import { createAdvSecProfile } from './Security20/functions';  //securityProfile: IAdvancedSecurityProfile,

import { IApprovedCDNs, IFetchInfo, ITagInfo, IApprovedFileType, ICDNCheck , IPolicyFlag, IPolicyFlagLevel, SourceInfo, IAdvancedSecurityProfile, IFileTypeSecurity, PolicyFlagStyles, ICacheInfo  } from './Security20/interface';
import { analyzeShippet, getFileDetails  } from './Security20/FetchCode';

import { simpleParse } from './Security20/Beautify/function';
import DOMPurify from 'dompurify';

//Added for Prop Panel Help
import stylesP from './PropPanelHelp.module.scss';
import { WebPartHelpElement } from './PropPaneHelp';

import { SourceNothing,
      SourceSecure,
      SourceLocal,
      SourceTenant,
      SourceExtApp,
      SourceWWW,
      SourceVerify,
      SourceWarn,
      SourceBlock, } from './Security20/interface';

import { buildSourceRankArray,  } from './Security20/functions';
import { tdProperties } from 'office-ui-fabric-react';

import { IPerformanceOp, ILoadPerformanceSS7, IHistoryPerformance } from './Performance/IPerformance';
import { startPerformInit, startPerformOp, updatePerformanceEnd,  } from './Performance/functions';
import stylesPerform from './Performance/performance.module.scss';
import { createCacheTableSmall, createPerformanceTableSmall,  } from './Performance/tables';
import { LimitedWebPartManager } from '@pnp/sp/webparts';



const stockPickerHTML = '<div class="tradingview-widget-container"><div id="tradingview"></div><div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div><script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>      <script type="text/javascript">      new TradingView.widget(      {      "width": 980,      "height": 610,      "symbol": "NASDAQ:AAPL",      "interval": "D",      "timezone": "Etc/UTC",      "theme": "light",      "style": "1",      "locale": "en",      "toolbar_bg": "#f1f3f6",      "enable_publishing": false,      "allow_symbol_change": true,"container_id": "tradingview"});</script></div>';

const pivotHeading0 : ICDNCheck = 'Block';  //2022-01-31: Added Pivot Tiles
const pivotHeading1 : ICDNCheck = 'Warn';  //Templates
const pivotHeading2 : ICDNCheck = 'WWW';  //Templates
const pivotHeadingV : ICDNCheck = 'Verify';  //Templates
const pivotHeading3 : ICDNCheck = 'Approved';  //Templates
const pivotHeading4 : ICDNCheck = 'Tenant';  //Templates
const pivotHeadingL : ICDNCheck = 'Local';  //Templates
const pivotHeading5 : ICDNCheck = 'SecureCDN';  //Templates
const pivotHeading6 : ICDNCheck = 'Nothing';  //Templates
const pivotHeading7 : IApprovedFileType = 'js';  //Templates
const pivotHeading8 : IApprovedFileType = 'css';  //Templates
const pivotHeading9 : IApprovedFileType = 'html';  //Templates
const pivotHeading10 : IApprovedFileType = 'img';  //Templates
const pivotHeading11 : IApprovedFileType = 'link';  //Templates
const pivotHeading12 : string = 'raw';  //Templates
const pivotHeading13 : string = 'profile';  //Templates
const pivotHeading14 : string = 'missing';  //Templates

const CheckingSpinner = <Spinner size={SpinnerSize.large} label={"checking ..."} style={{ padding: 30 }} />;

const fileButtonStyles = {
  backgroundColor: 'transparent',
  color: 'black',
  padding: '3px',
  fontSize: '17px',
  margin: '0',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'normal',
};

export default class SecureScript7 extends React.Component<ISecureScript7Props, ISecureScript7State> {

  private reStyleButtons( ) {
    const buttonStyles = defaultBannerCommandStyles;
    buttonStyles.margin = '0px 10px';
    return buttonStyles;
  }

  private reStyleButtons2( background: string = null, color: string = null ) {
    let buttonStyles = JSON.parse(JSON.stringify( defaultBannerCommandStyles )) ;
    buttonStyles.margin = '0px 10px';

    if ( background ) { buttonStyles.background = background; }
    if ( color ) { buttonStyles.color = color; }

    return buttonStyles;
  }

  private SourceNameRank = buildSourceRankArray();

  private currentPageUrl = this.props.bannerProps.pageContext.web.absoluteUrl + this.props.bannerProps.pageContext.site.serverRequestPath;

  /***
   *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b.      d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b .d8888. 
   *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D      88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 88'  YP 
   *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY'      88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    `8bo.   
   *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b        88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88      `Y8b. 
   *    88   8D 88   88 88  V888 88  V888 88.     88 `88.      88.     88booo. 88.     88  88  88 88.     88  V888    88    db   8D 
   *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    `8888Y' 
   *                                                                                                                                
   *                                                                                                                                
   */

  private hideClassicIcon = <div style={{ float: 'right', display: 'inline-block'}}><Icon iconName={ 'ChromeClose' } onClick={ this.hideClassicWarn.bind(this) } style={ this.reStyleButtons() } title='Show Raw HTML here'></Icon></div>;
  private hideModernIcon = <div style={{ float: 'right'}}><Icon iconName={ 'ChromeClose' } onClick={ this.hideModernWarn.bind(this) } style={ this.reStyleButtons() } title='Show Raw HTML here'></Icon></div>;
  
  private toggleRawIcon = <Icon iconName={ 'FileCode' } onClick={ this.toggleRaw.bind(this) } style={ this.reStyleButtons() } title='Show Raw HTML here'></Icon>;

  private toggleTagFile = <Icon iconName={ 'TextField' } onClick={ this.toggleTag.bind(this) } style={ this.reStyleButtons() } title='Show Raw HTML here'></Icon>;
  private toggleTagTag = <Icon iconName={ 'Tag' } onClick={ this.toggleTag.bind(this) } style={ this.reStyleButtons() } title='Show Raw HTML here'></Icon>;
  private toggleLiveWP = <Icon iconName={ 'Refresh' } onClick={ this.getLiveWebpart.bind(this) } style={ this.reStyleButtons2( 'white', 'black' ) } title='Analyize live webpart'></Icon>;
  private toggleFullPg = <Icon iconName={ 'DownloadDocument'} onClick={ this.getEntirePage.bind(this) } style={ this.reStyleButtons() } title='Analyize FULL Page'></Icon>;

  private toggleRunSandbox = <Icon iconName={ 'ConstructionCone'} onClick={ this.toggleSandbox.bind(this) } style={ this.reStyleButtons2( 'white', 'black' ) } title='Execute all scripts in Sandbox Mode'></Icon>;
  private toggleStopSandbox = <Icon iconName={ 'ConstructionConeSolid'} onClick={ this.toggleSandbox.bind(this) } style={ this.reStyleButtons2( 'yellow', 'red' ) } title='Stop Sandbox Mode'></Icon>;

  private tagPageNoteBlocks = 'Files BLOCKED due to a specific policy.';
  private tagPageNoteWarns = 'Files in High Risk locations (due to a policy) but still work.';
  private tagPageNoteWWW = 'Files elsewhere in the www.';
  private tagPageNoteExtApp = 'Files in External locations/CDNs that are approved';
  private tagPageNoteTenant = 'Files in this Tenant but not in the SecureCDN';
  private tagPageNoteSecure = 'Files in the Tenant\'s SecureCDN site';
  private tagPageNoteNothing =   <div>
        <a target="_blank" href="https://www.goodreads.com/author/show/879.Plato">
          <img alt="Plato" src="https://images.gr-assets.com/authors/1393978633p2/879.jpg" style={{ float: 'left', paddingRight: '20px'}}></img>
        </a>
        <div style={{display: 'flex', flexDirection: 'column' }}>
          <div>"I am the wisest man alive, for I know one thing, and that is that I know nothing."</div>
          <div>--<span>Plato,</span><span><a target="_blank" href="https://www.goodreads.com/work/quotes/1625515">The Republic</a></span>
        </div>
        </div>
      </div>
    ;

    private termsOfUse = <div className={ styles.termsOfUse }>
      <h2>Terms of use</h2>
      <ul>
        <li>Only store your HTML, JS and CSS files in a Company approved CDN</li>
        <li>Contact your SharePoint Team to request a space in our CDN</li>
        <br/>
        <li><span className={ styles.good}>DO USE</span> the web part properties to expand web part and control access to the back end site</li>
        <li><span className={ styles.bad}>DO NOT</span> interfere with the banner at the top of this web part.  It must remain visible and functional as it was designed.</li>
        <li><span className={ styles.bad}>DO NOT</span> execute any Javascript to change any SharePoint or DOM elements above your html content div</li>
        <li><span className={ styles.bad}>DO NOT</span> load any CSS that changes any SharePoint or DOM element styling above your html content div</li>
        <br/>
        <li>We can and do occasional audits to Verify compliance with the terms of use.</li>
        <br/>
        <li style={{ fontWeight: 'bold', fontSize: 'large' }}>Breaking any of these Terms of Use will cause your CDN access to be revoked.  aka your code will no longer work.</li>
      </ul>
    </div>;

  private tagPageNoteJS = 'Javascript Files';
  private tagPageNoteCSS = 'CSS Files';
  private tagPageNoteHTML = 'HTML Files';
  private tagPageNoteIMG = 'Image Files';
  private tagPageNoteLINK = 'Attribute Links';
  private tagPageNoteLOCAL = 'Local Files';
  private tagPageNoteVERIFY = 'Verify Tags';
  private tagPageNoteMissing = 'Missing 404';


  private page0 = this.buildTagPage( this.props.fetchInfo.Block, this.tagPageNoteBlocks, this.props.fetchInfo.policyFlags.Block ) ;
  private page1 = this.buildTagPage( this.props.fetchInfo.Warn, this.tagPageNoteWarns, this.props.fetchInfo.policyFlags.Warn );
  private page2 = this.buildTagPage( this.props.fetchInfo.www, this.tagPageNoteWWW );
  private page3 = this.buildTagPage( this.props.fetchInfo.Approved, this.tagPageNoteExtApp );
  private page4 = this.buildTagPage( this.props.fetchInfo.Tenant, this.tagPageNoteTenant );
  private page5 = this.buildTagPage( this.props.fetchInfo.Secure, this.tagPageNoteSecure );
  private page6 = this.buildTagPage( this.props.fetchInfo.Nothing, this.tagPageNoteNothing );

  private page7 = this.buildTagPage( this.props.fetchInfo.js, this.tagPageNoteJS );
  private page8 = this.buildTagPage( this.props.fetchInfo.css, this.tagPageNoteCSS );
  private page9 = this.buildTagPage( this.props.fetchInfo.html, this.tagPageNoteHTML );
  private page10 = this.buildTagPage( this.props.fetchInfo.img, this.tagPageNoteIMG );
  private page11 = this.buildTagPage( this.props.fetchInfo.link, this.tagPageNoteLINK );
  
  private pageL = this.buildTagPage( this.props.fetchInfo.Local, this.tagPageNoteLOCAL );
  private pageV = this.buildTagPage( this.props.fetchInfo.Verify, this.tagPageNoteVERIFY, [], 'Verify' );
  // private pageM = this.buildMissingPage( this.props.fetchInfo, this.tagPageNoteMissing, );


  private pivotBlock = <PivotItem headerText={'Block'} ariaLabel={pivotHeading0} title={pivotHeading0} itemKey={pivotHeading0} itemIcon={ SourceBlock.icon }/>;
  private pivotWarn = <PivotItem headerText={'Warn'} ariaLabel={pivotHeading1} title={pivotHeading1} itemKey={pivotHeading1} itemIcon={ SourceWarn.icon }/>;
  private pivotWWW = <PivotItem headerText={'WWW'} ariaLabel={pivotHeading2} title={pivotHeading2} itemKey={pivotHeading2} itemIcon={ SourceWWW.icon }/>;
  private pivotExtApp = <PivotItem headerText={'ExtApp'} ariaLabel={pivotHeading3} title={pivotHeading3} itemKey={pivotHeading3} itemIcon={ SourceExtApp.icon }/>;
  private pivotTenant = <PivotItem headerText={'Tenant'} ariaLabel={pivotHeading4} title={pivotHeading4} itemKey={pivotHeading4} itemIcon={ SourceTenant.icon }/>;
  private pivotSecure = <PivotItem headerText={'Secure'} ariaLabel={pivotHeading5} title={pivotHeading5} itemKey={pivotHeading5} itemIcon={ SourceSecure.icon }/>;
  private pivotNothing = <PivotItem headerText={ 'Nothing' } ariaLabel={pivotHeading6} title={pivotHeading6} itemKey={pivotHeading6} itemIcon={ SourceNothing.icon }/>;

  private pivotVerify = <PivotItem headerText={ 'Verify' } ariaLabel={pivotHeadingV} title={pivotHeadingV} itemKey={pivotHeadingV} itemIcon={ SourceVerify.icon }/>;
  private pivotLocal = <PivotItem headerText={ 'Local' } ariaLabel={pivotHeadingL} title={pivotHeadingL} itemKey={pivotHeadingL} itemIcon={ SourceLocal.icon }/>;

  private pivotJS = <PivotItem headerText={ null } ariaLabel={pivotHeading7} title={pivotHeading7} itemKey={pivotHeading7} itemIcon={ 'JS' }/>;
  private pivotCSS = <PivotItem headerText={ null } ariaLabel={pivotHeading8} title={pivotHeading8} itemKey={pivotHeading8} itemIcon={ 'CSS' }/>;
  private pivotHTML = <PivotItem headerText={ null } ariaLabel={pivotHeading9} title={pivotHeading9} itemKey={pivotHeading9} itemIcon={ 'FileHTML' }/>;
  private pivotIMG = <PivotItem headerText={ null } ariaLabel={pivotHeading10} title={pivotHeading10} itemKey={pivotHeading10} itemIcon={ 'Photo2' }/>;
  private pivotLINK = <PivotItem headerText={ null } ariaLabel={pivotHeading11} title={pivotHeading11} itemKey={pivotHeading11} itemIcon={ 'Link' }/>;
  private pivotRAW = <PivotItem headerText={ 'raw' } ariaLabel={'raw'} title={'raw'} itemKey={'raw'} itemIcon={ 'Embed' }/>;
  private pivotPROF = <PivotItem headerText={ null } ariaLabel={pivotHeading13} title={pivotHeading13} itemKey={pivotHeading13} itemIcon={ 'BookAnswers' }/>;
  private pivotMiss = <PivotItem headerText={ null } ariaLabel={pivotHeading14} title={pivotHeading14} itemKey={pivotHeading14} itemIcon={ 'PlugDisconnected' }/>;

  /***
 *    d8b   db d88888b  .d8b.  d8888b.      d88888b  .d8b.  d8888b.      d88888b db      d88888b 
 *    888o  88 88'     d8' `8b 88  `8D      88'     d8' `8b 88  `8D      88'     88      88'     
 *    88V8o 88 88ooooo 88ooo88 88oobY'      88ooo   88ooo88 88oobY'      88ooooo 88      88ooooo 
 *    88 V8o88 88~~~~~ 88~~~88 88`8b        88~~~   88~~~88 88`8b        88~~~~~ 88      88~~~~~ 
 *    88  V888 88.     88   88 88 `88.      88      88   88 88 `88.      88.     88booo. 88.     
 *    VP   V8P Y88888P YP   YP 88   YD      YP      YP   YP 88   YD      Y88888P Y88888P Y88888P 
 *                                                                                               
 *                                                                                               
 */

  private nearBannerElements = this.buildNearBannerElements();
  private farBannerElements = this.buildFarBannerElements();

  private buildNearBannerElements() {
    //See banner/NearAndFarSample.js for how to build this.
    let elements = [];
    // defaultBannerCommandStyles.fontWeight = 'bolder';
    // elements.push(<div style={{ paddingRight: null }} className={ '' } title={ title}>
    //   <Icon iconName='WindDirection' onClick={ this.jumpToParentSite.bind(this) } style={ defaultBannerCommandStyles }></Icon>
    // </div>);
    return elements;
  }

  private buildFarBannerElements() {
    //See banner/NearAndFarSample.js for how to build this.
    // minimizeTiles= { this.minimizeTiles.bind(this) }
    // searchMe= { this.searchMe.bind(this) }
    // showAll= { this.showAll.bind(this) }
    let farElements: any[] = [];

    if ( this.props.bannerProps.showTricks === true ) {
      farElements.push( null );
    }
    return farElements;
  }

/***
 *     .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *    8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *    8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *    Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                  
 *                                                                                                  
 */

  public constructor(props:ISecureScript7Props){
    super(props);
    // console.log('SecureScript7: constructor', this.toggleRawIcon);

    let urlVars : any = this.props.urlVars;
    let debugMode = urlVars.debug === 'true' ? true : false;
    let isWorkbench = this.currentPageUrl.indexOf('_workbench.aspx') > 0 ? true : false;

    let showDevHeader = debugMode === true || isWorkbench === true ? true : false;

    this.state = { 
      showDevHeader: showDevHeader,
      lastStateChange: '',
      isSiteAdmin: null,
      showOriginalHtml: false,
      showApprovedLocations: false,
      showRawHTML: false,
      toggleTag: 'files',
      selectedKey: this.props.fetchInfo.selectedKey,
      selectedKeyFile: this.props.fetchInfo.selectedKey,

      contextWarnClassic: null,
      contextWarnModern: null,

      fullBlockedHeight: true,
      showProfileLogic: false,
      showPanel: false,
      panelFileType: 'all',
      panelSource: 'TBD',
      fetchInfo: this.props.fetchInfo,
      scope: 'Loaded File',
      searchValue: '',

      //Prop Panel Help
      showPropsHelp: false,

      showCacheInfo: false,

      isDialogVisible: false,
      currentlySandbox: false,

      missingPage: CheckingSpinner,
      missingFetched: false,
      missing404: false,

    };

  }

  /***
 *    d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *    88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *    88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *    88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *    88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *    Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                    
 *                                                                                    
 */
  public componentDidUpdate(prevProps){

    if ( prevProps.fetchInstance !== this.props.fetchInstance ) {
      this.setStateFetchInfo( this.props.fetchInfo, 'Loaded File', '', this.state.showRawHTML );
    }

  }

  private setStateFetchInfo( fetchInfo: IFetchInfo, scope: IScope, value: string , showRawHTML: boolean ) {

    this.page0 = this.buildTagPage( fetchInfo.Block, this.tagPageNoteBlocks, fetchInfo.policyFlags.Block, '', value ) ;
    this.page1 = this.buildTagPage( fetchInfo.Warn, this.tagPageNoteWarns, fetchInfo.policyFlags.Warn , '', value  );
    this.page2 = this.buildTagPage( fetchInfo.www, this.tagPageNoteWWW, [] , '', value );
    this.page3 = this.buildTagPage( fetchInfo.Approved, this.tagPageNoteExtApp, [] , '', value );
    this.page4 = this.buildTagPage( fetchInfo.Tenant, this.tagPageNoteTenant, [] , '', value );
    this.page5 = this.buildTagPage( fetchInfo.Secure, this.tagPageNoteSecure, [] , '', value );
    this.page6 = this.buildTagPage( fetchInfo.Nothing, this.tagPageNoteNothing, [] , '', value );

    this.page7 = this.buildTagPage( fetchInfo.js, this.tagPageNoteJS, [] , '', value );
    this.page8 = this.buildTagPage( fetchInfo.css, this.tagPageNoteCSS, [] , '', value );
    this.page9 = this.buildTagPage( fetchInfo.html, this.tagPageNoteHTML, [] , '', value );
    this.page10 = this.buildTagPage( fetchInfo.img, this.tagPageNoteIMG, [] , '', value );
    this.page11 = this.buildTagPage( fetchInfo.link, this.tagPageNoteLINK, [] , '', value );

    this.pageL = this.buildTagPage( fetchInfo.Local, this.tagPageNoteLOCAL, [] , '', value );
    this.pageV = this.buildTagPage( fetchInfo.Verify, this.tagPageNoteVERIFY, [], 'Verify', value );


    let selectedKey = fetchInfo.selectedKey;

    this.setState({ 
      fetchInfo: fetchInfo,
      panelFileType: 'all',
      panelSource: 'TBD',
      selectedKey: selectedKey,
      selectedKeyFile: fetchInfo.selectedKey,
      scope: scope,
      showRawHTML: showRawHTML,
     });
  }


  private async getEntirePage() {
    let originalShowRaw = this.state.showRawHTML === true ? true : false;
    this.setState({ showRawHTML: false });
    await new Promise<void>(done => setTimeout(() => done(), 300));

    let htmlFragment = document.documentElement.innerHTML;
    let times = new Date();
    let securityProfile: IAdvancedSecurityProfile = createAdvSecProfile();  //This is required to reset all the counts

    const propsPerformance: ILoadPerformanceSS7 = this.props.fetchInfo.performance;
 
    let performance: ILoadPerformanceSS7 = startPerformInit( propsPerformance.spPageContextInfoClassic, propsPerformance.spPageContextInfoModern, propsPerformance.forceReloadScripts, this.props.displayMode, false );

    const fetchInfo: IFetchInfo = await analyzeShippet( htmlFragment , times, times, securityProfile, performance, this.props.displayMode, false,  );
    performance.fetch = JSON.parse(JSON.stringify( this.props.fetchInfo.performance.fetch ));
    performance.jsEval = JSON.parse(JSON.stringify( this.props.fetchInfo.performance.jsEval ));

    fetchInfo.selectedKey = this.state.selectedKey;
    this.setStateFetchInfo( fetchInfo, 'Entire Page', this.state.searchValue, originalShowRaw );

  }


  private async getLiveWebpart( ) {
    let times = new Date();
    let wpInstanceID = this.props.bannerProps.exportProps.wpInstanceID;
    let wpElement = document.getElementById( wpInstanceID );
    let htmlFragment = wpElement.innerHTML;
    let securityProfile: IAdvancedSecurityProfile = createAdvSecProfile();
    // this.setState( { scope: 'Current Webpart' } );

    const propsPerformance: ILoadPerformanceSS7 = this.props.fetchInfo.performance;
 
    let performance: ILoadPerformanceSS7 = startPerformInit( propsPerformance.spPageContextInfoClassic, propsPerformance.spPageContextInfoModern, propsPerformance.forceReloadScripts, this.props.displayMode, false );

    const fetchInfo: IFetchInfo = await analyzeShippet( htmlFragment , times, times, securityProfile, performance, this.props.displayMode, false   );
    performance.fetch = JSON.parse(JSON.stringify( this.props.fetchInfo.performance.fetch ));
    performance.jsEval = JSON.parse(JSON.stringify( this.props.fetchInfo.performance.jsEval ));

    fetchInfo.selectedKey = this.state.selectedKey;
    this.setStateFetchInfo( fetchInfo, 'Current Webpart', this.state.searchValue, this.state.showRawHTML );

  }

  /***
   *            db    db d8888b. d8888b.  .d8b.  d888888b d88888b      .d8888. d888888b  .d8b.  d888888b d88888b       .d88b.  d8b   db      d8888b. d8888b.  .d88b.  d8888b. .d8888.       .o88b. db   db  .d8b.  d8b   db  d888b  d88888b 
   *            88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88'  YP `~~88~~' d8' `8b `~~88~~' 88'          .8P  Y8. 888o  88      88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP      d8P  Y8 88   88 d8' `8b 888o  88 88' Y8b 88'     
   *            88    88 88oodD' 88   88 88ooo88    88    88ooooo      `8bo.      88    88ooo88    88    88ooooo      88    88 88V8o 88      88oodD' 88oobY' 88    88 88oodD' `8bo.        8P      88ooo88 88ooo88 88V8o 88 88      88ooooo 
   *            88    88 88~~~   88   88 88~~~88    88    88~~~~~        `Y8b.    88    88~~~88    88    88~~~~~      88    88 88 V8o88      88~~~   88`8b   88    88 88~~~     `Y8b.      8b      88~~~88 88~~~88 88 V8o88 88  ooo 88~~~~~ 
   *            88b  d88 88      88  .8D 88   88    88    88.          db   8D    88    88   88    88    88.          `8b  d8' 88  V888      88      88 `88. `8b  d8' 88      db   8D      Y8b  d8 88   88 88   88 88  V888 88. ~8~ 88.     
   *    C88888D ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      `8888Y'    YP    YP   YP    YP    Y88888P       `Y88P'  VP   V8P      88      88   YD  `Y88P'  88      `8888Y'       `Y88P' YP   YP YP   YP VP   V8P  Y888P  Y88888P 
   *                                                                                                                                                                                                                                        
   *                                                                                                                                                                                                                                        
   */

  

  /***
 *    d8888b. db    db d8888b. db      d888888b  .o88b.      d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *    88  `8D 88    88 88  `8D 88        `88'   d8P  Y8      88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *    88oodD' 88    88 88oooY' 88         88    8P           88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *    88~~~   88    88 88~~~b. 88         88    8b           88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *    88      88b  d88 88   8D 88booo.   .88.   Y8b  d8      88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *    88      ~Y8888P' Y8888P' Y88888P Y888888P  `Y88P'      88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                                                                            
 *                                                                                                            
 */

  public render(): React.ReactElement<ISecureScript7Props> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      spPageContextInfoClassic,
      spPageContextInfoModern,
      bannerProps,

    } = this.props;

    const {
      fetchInfo,
      toggleTag,
      showPanel,
      panelFileType,
      panelSource,
    } = this.state;

    let securityProfile:  IAdvancedSecurityProfile = fetchInfo.securityProfile;

    let propsHelp = <div className={ this.state.showPropsHelp !== true ? stylesP.bannerHide : stylesP.helpPropsShow  }>
        { WebPartHelpElement }
    </div>;

   // let farBannerElementsArray = [];
    let farBannerElementsArray = [...this.farBannerElements,
      this.props.showCodeIcon !== true ? null : <div title={'Show Code Details'}><Icon iconName={ 'Code' } onClick={ this.toggleOriginal.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon></div>,
    ];


    if ( this.props.displayMode === DisplayMode.Edit ) {
      farBannerElementsArray.push( 
        <Icon iconName='OpenEnrollment' onClick={ this.togglePropsHelp.bind(this) } style={ bannerProps.bannerCmdReactCSS }></Icon>
      );
    }

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


 
    let bannerSuffix = '';
    //Exclude the props.bannerProps.title if the webpart is narrow to make more responsive
    let bannerTitle = bannerProps.bannerWidth < 900 ? bannerProps.title : `${bannerProps.title} - ${bannerSuffix}`;
    
    if ( bannerTitle === '' ) { bannerTitle = 'Secure Script 7' ; }
    if ( this.props.displayMode === DisplayMode.Edit ) { bannerTitle += ( bannerProps.bannerWidth > 1100 ? ' JS Disabled during Edit' : 'JS Disabled' ) ; }

    let errorUnapprovedComponent = null;

    if ( this.props.cdnValid !== true ) {
      errorUnapprovedComponent = <div style={{height: 100, width: '100%', fontSize: 'large', background: 'yellow' }}>
      <h3>Only pick web from Approved sites:</h3>
        <p>
          <ul>
            {approvedSites.map(site => <li>{site.siteRelativeURL}</li>)}
          </ul>
        </p>
      </div>;
    }

    let originalInfo = null;
    let scriptHTML = null;
    if ( fetchInfo ) {
      scriptHTML = fetchInfo.errorHTML ? `${fetchInfo.errorHTML}` : fetchInfo.snippet;
    }
    
    /***
 *    d8888b. db       .d88b.   .o88b. db   dD      db   db d888888b .88b  d88. db      
 *    88  `8D 88      .8P  Y8. d8P  Y8 88 ,8P'      88   88 `~~88~~' 88'YbdP`88 88      
 *    88oooY' 88      88    88 8P      88,8P        88ooo88    88    88  88  88 88      
 *    88~~~b. 88      88    88 8b      88`8b        88~~~88    88    88  88  88 88      
 *    88   8D 88booo. `8b  d8' Y8b  d8 88 `88.      88   88    88    88  88  88 88booo. 
 *    Y8888P' Y88888P  `Y88P'   `Y88P' YP   YD      YP   YP    YP    YP  YP  YP Y88888P 
 *                                                                                      
 *                                                                                      
 */

    let blockHTML = null;
    if ( fetchInfo.runSandbox === true ) {
      let blockHeight = this.state.fullBlockedHeight === true ? '42px' : null;
      blockHTML = <div style={{ padding: '0 10px 10px 10px', background: 'yellow', height: blockHeight, overflow: 'hidden', cursor: 'pointer' }} onClick={ this.toggleBlockWarnHeight.bind(this)}>
        <h2>You are running in Sandbox Mode</h2>
        <ul>
        <li><b>All JS files should execute now</b></li>
          <li>Press the construction code Icon again to exit sandbox mode.</li>
        </ul>
      </div>;
    } else if ( fetchInfo.selectedKey === 'Block' ) {
      let blockHeight = this.state.fullBlockedHeight === true ? null : '50px';
      blockHTML = <div style={{ padding: '0 10px 10px 10px', background: 'yellow', height: blockHeight, overflow: 'hidden', cursor: 'pointer' }} onClick={ this.toggleBlockWarnHeight.bind(this)}>
        <h2>Some content could not be loaded because it was blocked for security reasons</h2>
        <ul>
        <li><b>NO javascript code will execute until</b> the blocked code is resolved.</li>
          <li>Click the 'Show Code' button in the upper right to see which files are blocked.</li>
          <li>Provided the html file is in a valid location, it and all content not considered blocked will show below.</li>
          <li><b>NOTE:</b> We have no way to detect what scripts are commented out.  So even commented out script tags will cause this message.</li>
        </ul>
      </div>;
    }


    /***
 *     .o88b.  .d88b.  d8888b. d88888b      d8888b.  .d8b.  d8b   db d88888b      db   db d888888b .88b  d88. db      
 *    d8P  Y8 .8P  Y8. 88  `8D 88'          88  `8D d8' `8b 888o  88 88'          88   88 `~~88~~' 88'YbdP`88 88      
 *    8P      88    88 88   88 88ooooo      88oodD' 88ooo88 88V8o 88 88ooooo      88ooo88    88    88  88  88 88      
 *    8b      88    88 88   88 88~~~~~      88~~~   88~~~88 88 V8o88 88~~~~~      88~~~88    88    88  88  88 88      
 *    Y8b  d8 `8b  d8' 88  .8D 88.          88      88   88 88  V888 88.          88   88    88    88  88  88 88booo. 
 *     `Y88P'  `Y88P'  Y8888D' Y88888P      88      YP   YP VP   V8P Y88888P      YP   YP    YP    YP  YP  YP Y88888P 
 *                                                                                                                    
 *                                                                                                                    
 */

    if ( this.state.showOriginalHtml ) {
      let directLink = <a href={ this.props.fileRelativeUrl } target='none'>{ this.props.libraryItemPicker }</a>;

        let thisPage: any = <div>'Temp'</div>;
        if ( this.state.selectedKey === pivotHeading0 ) { thisPage = this.page0[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading1 ) { thisPage = this.page1[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading2 ) { thisPage = this.page2[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading3 ) { thisPage = this.page3[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading4 ) { thisPage = this.page4[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading5 ) { thisPage = this.page5[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading6 ) { thisPage = this.page6[toggleTag] ; } else 

        if ( this.state.selectedKey === pivotHeading7 ) { thisPage = this.page7[toggleTag] ; } else 
        if ( this.state.selectedKey === pivotHeading8 ) { thisPage = this.page8[toggleTag]; } else 
        if ( this.state.selectedKey === pivotHeading9 ) { thisPage = this.page9[toggleTag]; } else 
        if ( this.state.selectedKey === pivotHeading10 ) { thisPage = this.page10[toggleTag]; } else 
        if ( this.state.selectedKey === pivotHeading11 ) { thisPage = this.page11[toggleTag]; } else 

        if ( this.state.selectedKey === pivotHeadingV ) { thisPage = this.pageV[toggleTag]; } else 
        if ( this.state.selectedKey === pivotHeadingL ) { thisPage = this.pageL[toggleTag]; } else 
        if ( this.state.selectedKey === pivotHeading11 ) { thisPage = this.page11[toggleTag]; } else 
        if ( this.state.selectedKey === 'raw' ) { 
          // let parsedHTML = parseCodeOriginal(fetchInfo.snippet, 'markup' );
          // let cleanHTML = DOMPurify.sanitize( parsedHTML );
          // thisPage = <div dangerouslySetInnerHTML={{__html: cleanHTML }}></div> ; 
          let tags = simpleParse( fetchInfo.snippet );
          
          let eles = tags.map( tag => { 
            let style = tag.length === 0 ? { minHeight: '15px', margin: '10px 0px', background: 'white' } : { margin: '10px 0px' };
            return <div style={ style }>{ tag }</div>;
          });
          let snipHeading = <div style={{fontSize: 'large' , }}>The raw data is {fetchInfo.snippet.length } characters and { eles.length } elements long :)</div>;
          thisPage = <div>{ snipHeading } { eles } </div>;
          // thisPage = <div> { fetchInfo.snippet } </div>;
        }
        if ( this.state.selectedKey === pivotHeading13 ) { 
          thisPage = <div>
            { this.getProfilePage() }
          </div> ;
         }
        let missPage = null;
        if ( this.state.selectedKey === pivotHeading14 ) { 
          // thisPage = this.state.missingFetched !== true ? <Spinner size={SpinnerSize.large} label={"checking ..."} /> : this.state.missingPage;
          thisPage = <div className = { styles.policies } >{ this.state.missingPage }</div>;
        }

        let pivotItems: any [] = [];

        if ( fetchInfo.Block.length > 0 ) { pivotItems.push( this.pivotBlock ); }
        if ( fetchInfo.Warn.length > 0 ) { pivotItems.push( this.pivotWarn ); }
        if ( fetchInfo.Verify.length > 0 ) { pivotItems.push( this.pivotVerify ); }
        if ( fetchInfo.www.length > 0 ) { pivotItems.push( this.pivotWWW ); }
        if ( fetchInfo.Approved.length > 0 ) { pivotItems.push( this.pivotExtApp ); }
        if ( fetchInfo.Tenant.length > 0 ) { pivotItems.push( this.pivotTenant ); }
        if ( fetchInfo.Local.length > 0 ) { pivotItems.push( this.pivotLocal ); }
        if ( fetchInfo.Secure.length > 0 ) { pivotItems.push( this.pivotSecure ); }
        if ( fetchInfo.Nothing.length > 0 ) { pivotItems.push( this.pivotNothing ); }
    
        if ( fetchInfo.js.length > 0 ) { pivotItems.push( this.pivotJS ); }
        if ( fetchInfo.css.length > 0 ) { pivotItems.push( this.pivotCSS ); }
        if ( fetchInfo.html.length > 0 ) { pivotItems.push( this.pivotHTML ); }
        if ( fetchInfo.img.length > 0 ) { pivotItems.push( this.pivotIMG ); }
        if ( fetchInfo.link.length > 0 ) { pivotItems.push( this.pivotLINK ); }
        if ( fetchInfo.snippet ) { pivotItems.push( this.pivotRAW ); }
        if ( fetchInfo.snippet ) { pivotItems.push( this.pivotMiss ); }

        pivotItems.push( this.pivotPROF );

        let pivotContent = <div><Pivot
            // styles={ pivotStyles }
            linkFormat={PivotLinkFormat.links}
            linkSize={PivotLinkSize.normal }
            onLinkClick={this._selectedIndex.bind(this)}
        > 
          { pivotItems }
        </Pivot>
        { thisPage }
        { missPage }
      </div>;


        const searchElement = this.state.showRawHTML !== true ? null :
          <div className = { null } style={{ paddingLeft: '15px', display: this.state.selectedKey === pivotHeading13 || this.state.selectedKey === 'raw' ? 'none' :  null }}><SearchBox
              // className={ styles.searchBox }
              styles={{ root: { width: 150 } } }
              placeholder="Search"
              defaultValue={ this.state.searchValue }
              value={ this.state.searchValue }
              onSearch={ this.searchForItems.bind(this) }
              // onBlur={ this._changeSearchOnBlur.bind(this) }
              onChange={ this.searchForItems.bind(this) }
              // onClick={ this._changeSearchOnFocus.bind(this) }
            />
          </div>;

        // const { fetch, jsEval, analyze } = fetchInfo.performance;

        // const loadRows = [
        //   <tr>
        //     <th>Process</th>
        //     <th>Mode</th>
        //     <th>Time</th>
        //     <th>ms</th>
        //   </tr>
        // ];
        // [ 'fetch', 'analyze', 'jsEval' ].map( part => {
        //   const thisPart : IPerformanceOp = fetchInfo.performance[part];
        //   if ( thisPart ) {
        //     let time = thisPart.startStr;
        //     loadRows.push( <tr>
        //       <td>{ thisPart.label }</td>
        //       <td>{ thisPart.mode === 1 ? 'View' : 'Edit' }</td>
        //       <td>{ time }</td>
        //       <td>{ thisPart.ms }</td>
        //     </tr>);
        //   }
        // });

        //  const loadSummary = <div className={ styles.secProfile } style={{ paddingLeft: '15px'}}>
        //    <div style={{paddingBottom: '8px'}}>forceReloadScripts: { JSON.stringify(fetchInfo.performance.forceReloadScripts )}</div>
        //    <table>
        //       {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
        //       { loadRows }
        //    </table>
        //  </div>;

        const isCachedText = fetchInfo.cache.wasCached === true === true ? 'Yep!' : 'Nope';
        const toggleCache = fetchInfo.cache.FileRef === '' ? null :  <Icon iconName='OfflineStorage' onClick={ this.showCacheInfo.bind(this) } style={ { cursor: 'pointer', fontSize: '20px', } } title="Show Cache Info"></Icon>;
        const toggleGetCache = fetchInfo.cache.FileRef !== '' ? null :  <Icon iconName='Download' onClick={ this.getShowCacheInfo.bind(this) } style={ { cursor: 'pointer', fontSize: '20px', } } title="Fetch Cache Info"></Icon>;

        const loadTable = this.state.showCacheInfo === false ?  createPerformanceTableSmall( fetchInfo.performance, fetchInfo.cache ) :  createCacheTableSmall( fetchInfo.cache, fetchInfo.cache ) ;

         const loadSummary = <div className={ stylesPerform.performance } style={{ paddingLeft: '15px', minWidth: '400px' }}>
         <div style={{paddingBottom: '8px'}}>forceReloadScripts: { JSON.stringify( fetchInfo.performance.forceReloadScripts )}, &nbsp;&nbsp;&nbsp;&nbsp;cache:  { isCachedText } { toggleCache } { toggleGetCache } </div>
          { loadTable }
       </div>;

/***
 *    db      d888888b d8888b. d8888b.  .d8b.  d8888b. db    db      db      d888888b d8b   db db   dD .d8888. 
 *    88        `88'   88  `8D 88  `8D d8' `8b 88  `8D `8b  d8'      88        `88'   888o  88 88 ,8P' 88'  YP 
 *    88         88    88oooY' 88oobY' 88ooo88 88oobY'  `8bd8'       88         88    88V8o 88 88,8P   `8bo.   
 *    88         88    88~~~b. 88`8b   88~~~88 88`8b      88         88         88    88 V8o88 88`8b     `Y8b. 
 *    88booo.   .88.   88   8D 88 `88. 88   88 88 `88.    88         88booo.   .88.   88  V888 88 `88. db   8D 
 *    Y88888P Y888888P Y8888P' 88   YD YP   YP 88   YD    YP         Y88888P Y888888P VP   V8P YP   YD `8888Y' 
 *                                                                                                             
 *                                                                                                             
 */

      let webViewerLink = <span onClick={() => this.onFileClick( encodeDecodeString(this.props.webPicker, 'decode') )} style={{ color: 'blue' , cursor: 'pointer' }}> [ open Site ]</span>;
      let libViewerLink = <span onClick={() => this.onFileClick( encodeDecodeString(this.props.libraryPicker, 'decode') )} style={{ color: 'blue' , cursor: 'pointer' }}> [ open library ]</span>;

      let displayFile = this.props.libraryItemPicker + '';
      displayFile = displayFile.replace(`${this.props.libraryPicker}/`,'');
      let titleFile = displayFile + '';

      let fileFolders = displayFile.split('/');
      fileFolders = fileFolders.map( (folder, index ) => {
          return folder = index === fileFolders.length -1 ? folder : '..';
      });
      displayFile = fileFolders.join('/');

      let fileViewerhref = `${this.props.libraryPicker}/Forms/AllItems.aspx?id=${ this.props.fileRelativeUrl }&parent=${this.props.libraryPicker}`;
      let fileViewerLink = <span onClick={() => this.onFileClick( fileViewerhref )} style={{ color: 'blue' , cursor: 'pointer' }} title={ titleFile }> [ open file in editor ]</span>;

      let buttons = [this.toggleRawIcon];
      if ( this.state.showRawHTML !== false ) {
        if ( this.state.toggleTag === 'files' ) {
          buttons.push( this.toggleTagFile );
        } else { buttons.push ( this.toggleTagTag ) ; }
        buttons.push( this.toggleLiveWP );
        if ( bannerProps.showTricks === true ) { buttons.push( this.toggleFullPg ); }
       }
       buttons.push( <span style={{ padding: '0 20px' }}>{this.state.scope}</span> );

       if ( fetchInfo.selectedKey === 'Block' || this.props.cdnValid !== true ) { //Only add Sandbox if the code has block material
        buttons.push( fetchInfo.runSandbox === true ? this.toggleStopSandbox : this.toggleRunSandbox );
       }


       let contextInfo = null;
       if( this.props.spPageContextInfoClassic || this.props.spPageContextInfoModern ) { 
         let constRows = [];
         if ( this.props.spPageContextInfoClassic ) constRows.push( <span style={{color:'red', paddingLeft: '20px'}}>_legacyPageConext</span> );
         if ( this.props.spPageContextInfoModern ) constRows.push( <span style={{color:'green', paddingLeft: '20px'}}>_PageConext</span> );
         contextInfo = <li style={{ paddingBottom: '8px', fontSize: 'larger' }}><b>Context loaded:</b> { constRows }</li>;
        }

      //toggleReload
      const flexStyles: React.CSSProperties = { color: 'darkblue', display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' };

      originalInfo = <div style={{ background: '#dddd', padding: '10px 20px 40px 20px',  }}>
        <h2 style={{ color: 'darkblue', display: 'flex' }}>This is the original html <span style={{ display: 'flex', paddingLeft: '30px'}}>{ buttons }</span></h2>
        <div style={ flexStyles }>
          <div>
            <ul>
              <li style={{ paddingBottom: '8px', fontSize: 'larger' }}><b>Site:</b>{ ` ${this.props.webPicker}` } { webViewerLink } </li>
              <li style={{ paddingBottom: '8px', fontSize: 'larger' }}><b>Library:</b>{ ` ${this.props.libraryPicker.replace( this.props.webPicker,'' ) }` } { libViewerLink } </li>
              <li style={{ paddingBottom: '8px', fontSize: 'larger' }}><b>File:</b> { displayFile } {  fileViewerLink }  </li>
              { contextInfo }
            </ul>
          </div>
          <div>
            { searchElement }
          </div>
          <div>
            { loadSummary }
          </div>
        </div>

        {
          this.state.showRawHTML !== true ? null : pivotContent
        }
      </div>;
    }





  /***
 *    d8888b.  .d8b.  d8b   db d8b   db d88888b d8888b.      d88888b db      d88888b .88b  d88. d88888b d8b   db d888888b 
 *    88  `8D d8' `8b 888o  88 888o  88 88'     88  `8D      88'     88      88'     88'YbdP`88 88'     888o  88 `~~88~~' 
 *    88oooY' 88ooo88 88V8o 88 88V8o 88 88ooooo 88oobY'      88ooooo 88      88ooooo 88  88  88 88ooooo 88V8o 88    88    
 *    88~~~b. 88~~~88 88 V8o88 88 V8o88 88~~~~~ 88`8b        88~~~~~ 88      88~~~~~ 88  88  88 88~~~~~ 88 V8o88    88    
 *    88   8D 88   88 88  V888 88  V888 88.     88 `88.      88.     88booo. 88.     88  88  88 88.     88  V888    88    
 *    Y8888P' YP   YP VP   V8P VP   V8P Y88888P 88   YD      Y88888P Y88888P Y88888P YP  YP  YP Y88888P VP   V8P    YP    
 *                                                                                                                        
 *                                                                                                                        
 */

    let Banner = <WebpartBanner 

      FPSUser={ bannerProps.FPSUser }
      exportProps={ bannerProps.exportProps }
      showBanner={ bannerProps.showBanner }
      // Adding this to adjust expected width for when prop pane could be opened
      bannerWidth={ ( bannerProps.bannerWidth ) }
      pageContext={ bannerProps.pageContext }
      pageLayout={ bannerProps.pageLayout }
      title ={ bannerTitle }
      panelTitle = { bannerProps.panelTitle }
      infoElement = { bannerProps.infoElement }
      bannerReactCSS={ bannerProps.bannerReactCSS }
      bannerCmdReactCSS={ bannerProps.bannerCmdReactCSS }
      showTricks={ bannerProps.showTricks }
      showGoToParent={ bannerProps.showGoToParent }
      showGoToHome={ bannerProps.showGoToHome }
      onHomePage={ bannerProps.onHomePage }

      webpartHistory={ this.props.webpartHistory }
      
      showBannerGear={ bannerProps.showBannerGear }
      
      showFullPanel={ bannerProps.showFullPanel }
      replacePanelHTML={ bannerProps.replacePanelHTML }
      replacePanelWarning={ bannerProps.replacePanelWarning }

      hoverEffect={ bannerProps.hoverEffect }
      gitHubRepo={ bannerProps.gitHubRepo }
      earyAccess={ bannerProps.earyAccess }
      wideToggle={ bannerProps.wideToggle }
      nearElements = { this.nearBannerElements }
      farElements = { farBannerElementsArray }

      showRepoLinks={ bannerProps.showRepoLinks }
      showExport={ bannerProps.showExport }
      //2022-02-17:  Added these for expandoramic mode
      domElement = { bannerProps.domElement }
      enableExpandoramic = { bannerProps.enableExpandoramic }
      expandoDefault = { bannerProps.expandoDefault }
      expandoStyle = { bannerProps.expandoStyle}
      expandAlert = { bannerProps.expandAlert }
      expandConsole = { bannerProps.expandConsole }
      expandoPadding = { bannerProps.expandoPadding }
      beAUser = { bannerProps.beAUser }
      showBeAUserIcon = { bannerProps.showBeAUserIcon }
       beAUserFunction={ bannerProps.beAUserFunction }

    ></WebpartBanner>;

    let actualElement = <div></div>;

    let devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { 'this.props.lastPropChange' + ', ' + 'this.props.lastPropDetailChange' } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;

    let termsOfUse = fetchInfo == null || fetchInfo.snippet.length === 0 ? this.termsOfUse : null;

    let spPageContextInfoContent : any[] = [] ; //this.props.displayMode === DisplayMode.Edit && spPageContextInfoClassic === true ? [this.spPageContextInfoClassic ]: [];


    //https://github.com/mikezimm/SecureScript7/issues/71
    if ( this.props.displayMode === DisplayMode.Edit ) {
      const classicCollapse: React.CSSProperties = { height: this.state.contextWarnClassic , overflow: 'hidden'  };
      const modernCollapse: React.CSSProperties = { height: this.state.contextWarnModern , overflow: 'hidden' };


      const classicContextBlock = <div className={ styles.classicContext } onClick={ this.toggleClassicWarnHeight.bind(this) } style={ classicCollapse }>
        {/* <h2>Classic <b>spPageContextInfo</b> is enabled { this.hideClassicIcon } </h2> */}
        <h2>Classic <b>spPageContextInfo</b> is enabled</h2>
        <div>These properties <b>can be deprecated at any time without any notice!  <span style={{ paddingLeft: '20px', color: 'red'}} >USE AT YOUR OWN RISK</span></b>  </div>
      </div>;

      const modernContextBlock = <div className={ styles.modernContext } onClick={ this.toggleModernWarnHeight.bind(this) }  style={ modernCollapse }>
        {/* <h2>Modern <b>spPageContextInfo</b> is enabled{ this.hideModernIcon }</h2> */}
        <h2>Modern <b>spPageContextInfo</b> is enabled</h2>
      </div>;


      if ( spPageContextInfoClassic === true ) {  spPageContextInfoContent.push( <div style={ classicCollapse }>{ classicContextBlock }</div> ) ;  }
      if ( spPageContextInfoModern === true ) {  spPageContextInfoContent.push( <div style={ modernCollapse }> { modernContextBlock } </div> ) ;  }
      // if ( spPageContextInfoClassic === true ) {  spPageContextInfoContent.push( { classicContextBlock } ) ;  }
      // if ( spPageContextInfoModern === true ) {  spPageContextInfoContent.push( { modernContextBlock } ) ;  }
    }

    /***
 *    d8888b.  .d8b.  d8b   db d88888b db      
 *    88  `8D d8' `8b 888o  88 88'     88      
 *    88oodD' 88ooo88 88V8o 88 88ooooo 88      
 *    88~~~   88~~~88 88 V8o88 88~~~~~ 88      
 *    88      88   88 88  V888 88.     88booo. 
 *    88      YP   YP VP   V8P Y88888P Y88888P 
 *                                             
 *                                             
 */

    let bannerPanel = null;

    if ( showPanel === true ) {
      let currentCDNs = [];
      let currentFiles = [];
      let policyIdx = -1;

      ['Approved','Warn','Block'].map( cdn => {
        if ( securityProfile[ panelFileType].cdns[ cdn ].length > 0 ) {
          securityProfile[ panelFileType].cdns[ cdn ].map( ( url, idx ) => {
            policyIdx ++;
            currentCDNs.push( <tr><td>{ policyIdx }</td><td>{ cdn }</td><td>{ url }</td></tr> );
          });
        }
      });


      if ( panelFileType !== 'all' ) {
        if ( fetchInfo[ panelFileType].length > 0 ) {
          let fileIdx = -1;
          fetchInfo[ panelFileType].map( ( tag: ITagInfo ) => {
            if ( tag.location === panelSource ) {
              fileIdx ++;
              // let rowStyle = securityProfile[ panelFileType ].styles[ tag.rank ];
              let rowStyle = tag.fileStyle;
              // currentFiles.push( <tr style={PolicyFlagStyles[ tag.policyFlags.level ]}><td>{ idx }</td><td style={{ whiteSpace: 'nowrap'}}>{ location }</td><td>{ tag.type }</td><td>{ tag.file }</td></tr> );
              currentFiles.push( <tr style={ rowStyle }><td>{ fileIdx }</td><td style={{ whiteSpace: 'nowrap'}}>{ tag.location }</td><td>{ tag.type }</td><td>{ tag.file }</td></tr> );
            }
          });
        }
      }

      let panelContent = <div className={ styles.policyPanel } style={ null }>
        <div className={ styles.tableHeading }>File type specific policies for { panelFileType } files ( { currentCDNs.length } )</div>
        <table>
          { currentCDNs }
        </table>
        <div className={ styles.tableHeading }>{ `${panelFileType}` } Files found in { `${panelSource}` } ( { currentFiles.length } )</div>
        <table>
          { currentFiles }
        </table>
        
      </div>;

      bannerPanel = <div><Panel
          isOpen={ showPanel }
          // this prop makes the panel non-modal
          isBlocking={true}
          onDismiss={ this._closePanel.bind(this) }
          closeButtonAriaLabel="Close"
          type = { PanelType.large }
          isLightDismiss = { true }
        >
        { panelContent }
      </Panel></div>;
      }

      // const dialogContentProps = {
      //   type: DialogType.normal,
      //   title: 'dialogContentProps - Title.',
      // };

      // const dialogModalProps = {
      //   isBlocking: true,
      //   styles: { main: { maxWidth: 450 } },
      // };

      // const SandboxDialog = this.state.isDialogVisible !== true ? null : <Dialog
      //   hidden={ !this.state.isDialogVisible }
      //   onDismiss={ this.cancelSandBoxMode.bind(this) }
      //   dialogContentProps={ dialogContentProps }
      //   modalProps={ dialogModalProps }
      //   >
      //   <DialogFooter>
      //     <DefaultButton onClick={ this.cancelSandBoxMode.bind(this)} text={ 'Do NOT load scripts'} />
      //     <PrimaryButton onClick={ this.confirmSandBoxMode.bind(this)} text={'Load Scripts'} />
      //   </DialogFooter>
      // </Dialog>;

      const dialogElement = <div>
        <div style={{fontSize: 'large', lineHeight: 1.5, color: 'red', fontWeight: 600, paddingTop: '15px' }}>This will execute script that may be UNSAFE.</div>
        <div style={{fontSize: 'large', color: 'red', fontWeight: 600, paddingBottom: '30px' }}>Use only if you know what you are doing :)</div>
        <div style={{fontSize: 'normal', color: 'black', fontWeight: 600, paddingBottom: '20px'  }}>If you do not know what this means, press Cancel :)</div>
      </div>;

      const ThisDialogProps : IMyBigDialogProps = {
        title: 'Do you REALLY WANT to run in Sandbox?  ',
        // dialogMessage: 'If you do not know what this means, press Cancel :)',
        dialogElement: dialogElement,
        showDialog: this.state.isDialogVisible,
        confirmButton: 'I konw what I\'m doing - Execute Code',
        _confirmDialog: this.confirmSandBoxMode.bind( this ),
        _closeDialog: this.cancelSandBoxMode.bind( this ),
      };

      const SandboxDialog = this.state.isDialogVisible !== true ? null : buildConfirmDialogBig( ThisDialogProps ) ;

/***
 *    d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *    88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *    88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *    88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *    88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *    88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                       
 *                                                       
 */

    return (
      <section className={`${styles.secureScript7} ${hasTeamsContext ? styles.teams : ''}`}>
        { devHeader }
        { spPageContextInfoContent }
        { Banner }
        { propsHelp }
        { blockHTML }
        { originalInfo }
        { termsOfUse }
        { actualElement }
        { bannerPanel }
        { SandboxDialog }
      </section>
    );
  }

/***
 *     d888b  d88888b d888888b      d8888b. d8888b.  .d88b.  d88888b d888888b db      d88888b      d8888b.  .d8b.   d888b  d88888b 
 *    88' Y8b 88'     `~~88~~'      88  `8D 88  `8D .8P  Y8. 88'       `88'   88      88'          88  `8D d8' `8b 88' Y8b 88'     
 *    88      88ooooo    88         88oodD' 88oobY' 88    88 88ooo      88    88      88ooooo      88oodD' 88ooo88 88      88ooooo 
 *    88  ooo 88~~~~~    88         88~~~   88`8b   88    88 88~~~      88    88      88~~~~~      88~~~   88~~~88 88  ooo 88~~~~~ 
 *    88. ~8~ 88.        88         88      88 `88. `8b  d8' 88        .88.   88booo. 88.          88      88   88 88. ~8~ 88.     
 *     Y888P  Y88888P    YP         88      88   YD  `Y88P'  YP      Y888888P Y88888P Y88888P      88      YP   YP  Y888P  Y88888P 
 *                                                                                                                                 
 *                                                                                                                                 
 */

private getProfilePage() {

  // <ReactJson src={ this.props.securityProfile } name={ 'Security Profile' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/>
  // <ReactJson src={ SourceInfo } name={ 'SourceInfo' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/>

  let rows: any[] = [];
  let headings = [<th>Type</th>];

  const profileHeading = <div className={ styles.secProfile }>
    <div onClick={ this.toggleLogic.bind(this) } className={ styles.profHeading} >Click me for Security Profile parsing logic - what causes code to be blocked.</div>
    <div className={ [ styles.logicContent , this.state.showProfileLogic === true ? null : styles.logicContentHide ].join( ' ')}>
      <ul>
        <li>From Left &gt; Right, Left side is more controled/secure, Right is more risky.</li>
        <li>Each file type ( js, css, image etc... ) has it's own profile and rules.</li>
        <li>Each type has a general 'threashold' for Warning and Block based on the location (column)</li>
        <ul>
          <li>Green cells are approved locations, bright yellow are blocked, the rest are considered a Warning (higher risk) </li>
          <li>Each cell has an icon that matches the tabs above where you can see all tags in that category.</li>

        </ul>
        <li>Each type can have individual blocked/approved/warn list of locations.</li>
        <ul>
          <li>Number to right of file type says how many apply.</li>
        </ul>
        <li>Blocking and Warning is determined in the following order... the first that is found is one that is applied</li>
        <ul>
          <li>Block &gt; Warned &gt; Approved  &gt; SecureCDN  &gt; Local  &gt; Tenant  &gt; WWW</li>
        </ul>
        <li>Items marked as Verify may also be found in other categories.  They just have some anomoly that was detected.</li>
      </ul>
    </div>

  </div>;

  SourceInfo.ranks.map( rank => {
    headings.push( <th>{ rank.name } </th> );
  });

  rows.push( <tr>{ headings } </tr>  );

  this.state.fetchInfo.securityProfile.sort.map( typeExt => {
    let cells: any[] = [];
    let thisType: IFileTypeSecurity = this.state.fetchInfo.securityProfile[typeExt];
    let cdns: string | number = thisType.cdns.Approved.length +thisType.cdns.Warn.length  +thisType.cdns.Block.length ;
    cdns = cdns === 0 ? '-' : cdns;
    cells.push( <td>{ thisType.title } ( { cdns } )</td>);
    thisType.styles.map ( ( style, idx ) => {
      const icon = <Icon iconName={ SourceInfo.ranks[ idx ].icon } ></Icon>;
      let counts: number | string = thisType.counts [ SourceInfo.ranks[ idx ].name ];
      counts = counts === 0 ? '-' : counts;
      style = JSON.parse(JSON.stringify( style ) );
      style.fontWeight = counts > 0 ? 'bold' : '';
      cells.push( <td  style={ style } onClick={() => this._showPanel( thisType.ext, SourceInfo.ranks[ idx ].name )} > { icon } { counts }</td>);
    });

    rows.push( <tr>{ cells }</tr> );

  });

  let pane = <div>
    { profileHeading }
    <table className = {styles.secProfile }>{ rows }</table>
    <ReactJson src={ this.props.securityProfile } name={ 'Security Profile' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/>
    <ReactJson src={ SourceInfo } name={ 'SourceInfo' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/>
  </div> ;

  return pane;


}


//Sent to @mikezimm/npmfunctions@1.0.226
// private async _LinkStatus(url)
// {
//     //Require this is filled out.
//     if ( !url ) { return false; }

//     var http = new XMLHttpRequest();
//     http.open('HEAD', url, false);
//     let isValid: boolean | number = true;
//     try {
//       await http.send();
//       isValid = http.status;

//     }catch(e) {
//       isValid = false;
//     }

//     return isValid;
// } 

private async buildMissingPage(  fetchInfo: IFetchInfo, message: any, ) {
  let files = [];
  let missing404 = false;
  files.push(  <tr style={ null }><th style={{ minWidth: '40px' }}>{ 'idx' }</th><th style={{ whiteSpace: 'nowrap'}}>Status</th><th>Type</th><th>Open</th><th>File Name</th></tr> );
  
  let tagsInfo = [ ...fetchInfo.js, ...fetchInfo.css , ...fetchInfo.img, ...fetchInfo.link ];
  
  for (let i = 0; i < tagsInfo.length; i++) {
    let tag  = tagsInfo[ i] ;
    
    let verifyTag = tag.file && tag.file.length > 0 && tag.file !== '#' && ( tag.file.indexOf('+') < 0 || tag.file.indexOf('+') > 10 ) ? true : false;

    if ( verifyTag === true ) {
      const canCheckLocation = tag.location === 'Approved' || tag.location === 'Local';
      // tag.found = tag.found !== undefined  || tag.location === 'Verify' ? tag.found : await this._LinkStatus( tag.file );
      tag.found = tag.location === 'Verify' ? tag.found : await _LinkStatus( tag.file );
      if ( tag.found === 404 && tag.file.indexOf('.') === 0 ) {
        missing404 = true;
      }
      const foundLabel = tag.location === 'Verify' ? 'unkonwn' : tag.found === true ? 'true' : tag.found === false ? 'false' : tag.found;
      let openIcon = <Icon iconName={ 'OpenFile' } onClick={ () => { window.open( tag.file, '_none') ; } } style={ { cursor: 'pointer' } } title={`Open file: ${tag.file}`}></Icon>;
      files.push(  <tr style={ tag.fileStyle }><td>{ i }</td><td style={{ whiteSpace: 'nowrap'}}>{ foundLabel }</td><td>{ tag.type }</td><td>{ openIcon }</td><td>{ tag.file }</td></tr> );
    }

    // files.push(  <div>test</div> );
  }

  const onCodeSite = window.location.href.toLowerCase().indexOf( this.props.webPicker.toLowerCase()) > -1 ? true : false;
  const missing404Ele = missing404 === false ? null : <div style={{ fontWeight: 600, paddingBottom: '10px' }}><mark>NOTICE:</mark> Some of your 404s have ..local references.</div>;
  const onCodeMessage = onCodeSite === true ? null : <div style={{ fontSize: 'larger', color: 'red', fontWeight: 600, paddingBottom: '10px' }}>You realize your code library is on a different site right???</div>;
  const libLocation = onCodeSite === true ? null : <div style={{ display: 'flex', flexWrap: 'nowrap' }}><div style={{minWidth: '100px', fontWeight: 600 }}>CODE is on</div><div>{ this.props.webPicker  } </div></div>;
  const currentLocation = onCodeSite === true ? null : <div style={{ display: 'flex', flexWrap: 'nowrap'}}><div style={{minWidth: '100px', fontWeight: 600}}>YOU are on</div><div>{ window.location.pathname.split( '/SitePages/')[0] }</div> </div>;

  let fileTable = <div>
    <div style={{ fontSize: 'larger', fontWeight: 600, textDecoration: 'underline', paddingBottom: '15px' }}>{ message }</div>
    { missing404Ele }
    { onCodeMessage }
    { libLocation }
    { currentLocation }

    <table className = {styles.secProfile }>{ files }</table>
    {/* <ReactJson src={ this.props.securityProfile } name={ 'Security Profile' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/>
    <ReactJson src={ SourceInfo } name={ 'SourceInfo' } collapsed={ true } displayDataTypes={ true } displayObjectSize={ true } enableClipboard={ true } style={{ padding: '10px 0px' }}/> */}
  </div> ;

    return fileTable;

}


/***
 *    d8888b. db    db d888888b db      d8888b.      d888888b  .d8b.   d888b       d8888b.  .d8b.   d888b  d88888b 
 *    88  `8D 88    88   `88'   88      88  `8D      `~~88~~' d8' `8b 88' Y8b      88  `8D d8' `8b 88' Y8b 88'     
 *    88oooY' 88    88    88    88      88   88         88    88ooo88 88           88oodD' 88ooo88 88      88ooooo 
 *    88~~~b. 88    88    88    88      88   88         88    88~~~88 88  ooo      88~~~   88~~~88 88  ooo 88~~~~~ 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D         88    88   88 88. ~8~      88      88   88 88. ~8~ 88.     
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'         YP    YP   YP  Y888P       88      YP   YP  Y888P  Y88888P 
 *                                                                                                                 
 *                                                                                                                 
 */


  private buildTagPage( tagsInfo: ITagInfo[], message: any, policyFlags: IPolicyFlag[] = [], special: 'Verify' | '' = '', searchValue : string = '' ) {
    let files = [];
    
    tagsInfo.map( ( tag: ITagInfo, idx ) => {  
      if ( searchValue.length > 0 ) {
        if ( tag.tag.toLowerCase().indexOf( searchValue.toLowerCase() ) === -1 ) {
          return;
        }
      } 
      let level = special === 'Verify' ? tag.policyFlags.Verify.join(' ') : tag.policyFlags.level;
      let openIcon = <Icon iconName={ 'OpenFile' } onClick={ () => { window.open( tag.file, '_none') ; } } style={ { cursor: 'pointer' } } title={`Open file: ${tag.file}`}></Icon>;
      files.push(  <tr style={ tag.fileStyle }><td>{ idx }</td><td style={{ whiteSpace: 'nowrap'}}>{ level }</td><td>{ tag.type }</td><td>{ openIcon }</td><td>{ tag.file }</td></tr> );
    });

    let fileTable = <table>
        { files }
      </table>;

    let tags = [];
    tagsInfo.map( ( tag: ITagInfo, idx ) => {
      if ( searchValue.length > 0 ) {
        if ( tag.tag.toLowerCase().indexOf( searchValue.toLowerCase() ) === -1 ) {
          return;
        }
      }
      let parts = tag.tag.split( tag.fileOriginal );
      let tagCell = <td>{`${ parts[0] }`}<b>{`${ tag.fileOriginal }`}</b>{`${ parts[1] }`}</td>;
      let level = special === 'Verify' ? tag.policyFlags.Verify.join(' ') : tag.policyFlags.level;
      let openIcon = <Icon iconName={ 'OpenFile' } onClick={ () => { window.open( tag.file, '_none') ; } } style={ null } title={`Open file: ${tag.file}`}></Icon>;
      tags.push( <tr style={ tag.fileStyle }><td>{ idx }</td><td style={ null }>{ level }</td><td>{ tag.type }</td><td>{ openIcon }</td>{ tagCell }</tr> );
    });

    let tagTable = <table>
      { tags }
    </table>;

    let policies = policyFlags.map( ( policy, idx ) => {
      return <tr><td>{ idx }</td><td>{ policy.level }</td><td>{ policy.type }</td><td>{ policy.cdn }</td></tr>;
    });

    let policyMessage =  policyFlags.length === 0 ? null : <div style={{paddingBottom: '30px' }}>
      <div style={{fontSize: 'larger', fontWeight: 'bold' }}>Policies triggered</div>
      <table>
        { policies }
      </table>
    </div>;

    let messageDiv = <div style={{ fontWeight: 'bold', display: 'grid' }}>{ `${message} - ( ${ tags.length } )` }</div>;
    let result = {
      files: <div className = { styles.policies } >{ policyMessage  }{ messageDiv  }{ fileTable }</div>,
      tags: <div className = { styles.policies } >{ policyMessage  }{ messageDiv  }{ tagTable }</div>,
      message: <div>{message}</div>
    };

    return result;

  }


  public searchForItems = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    const value = item.target.value;
    // if ( this.state.changePivotCats === true ) {
      const fetchInfo = this.state.fetchInfo;
    
      this.page0 = this.buildTagPage( fetchInfo.Block, this.tagPageNoteBlocks, fetchInfo.policyFlags.Block, '', value ) ;
      this.page1 = this.buildTagPage( fetchInfo.Warn, this.tagPageNoteWarns, fetchInfo.policyFlags.Warn , '', value  );
      this.page2 = this.buildTagPage( fetchInfo.www, this.tagPageNoteWWW, [] , '', value );
      this.page3 = this.buildTagPage( fetchInfo.Approved, this.tagPageNoteExtApp, [] , '', value );
      this.page4 = this.buildTagPage( fetchInfo.Tenant, this.tagPageNoteTenant, [] , '', value );
      this.page5 = this.buildTagPage( fetchInfo.Secure, this.tagPageNoteSecure, [] , '', value );
      this.page6 = this.buildTagPage( fetchInfo.Nothing, this.tagPageNoteNothing, [] , '', value );
    
      this.page7 = this.buildTagPage( fetchInfo.js, this.tagPageNoteJS, [] , '', value );
      this.page8 = this.buildTagPage( fetchInfo.css, this.tagPageNoteCSS, [] , '', value );
      this.page9 = this.buildTagPage( fetchInfo.html, this.tagPageNoteHTML, [] , '', value );
      this.page10 = this.buildTagPage( fetchInfo.img, this.tagPageNoteIMG, [] , '', value );
      this.page11 = this.buildTagPage( fetchInfo.link, this.tagPageNoteLINK, [] , '', value );
  
      this.pageL = this.buildTagPage( fetchInfo.Local, this.tagPageNoteLOCAL, [] , '', value );
      this.pageV = this.buildTagPage( fetchInfo.Verify, this.tagPageNoteVERIFY, [], 'Verify', value );

      this.setState({
        searchValue: value,
        lastStateChange: 'searchForItems',
      });
  
      return ;

    // }
 
  } //End searchForItems

  /***
 *     d888b  d88888b d888888b       .o88b.  .d88b.  db       .d88b.  d8888b.      .d8888. d888888b db    db db      d88888b 
 *    88' Y8b 88'     `~~88~~'      d8P  Y8 .8P  Y8. 88      .8P  Y8. 88  `8D      88'  YP `~~88~~' `8b  d8' 88      88'     
 *    88      88ooooo    88         8P      88    88 88      88    88 88oobY'      `8bo.      88     `8bd8'  88      88ooooo 
 *    88  ooo 88~~~~~    88         8b      88    88 88      88    88 88`8b          `Y8b.    88       88    88      88~~~~~ 
 *    88. ~8~ 88.        88         Y8b  d8 `8b  d8' 88booo. `8b  d8' 88 `88.      db   8D    88       88    88booo. 88.     
 *     Y888P  Y88888P    YP          `Y88P'  `Y88P'  Y88888P  `Y88P'  88   YD      `8888Y'    YP       YP    Y88888P Y88888P 
 *                                                                                                                           
 *                                                                                                                           
 */

  /***
 *    .d8888. d88888b db      d88888b  .o88b. d888888b      d888888b d8b   db d8888b. d88888b db    db 
 *    88'  YP 88'     88      88'     d8P  Y8 `~~88~~'        `88'   888o  88 88  `8D 88'     `8b  d8' 
 *    `8bo.   88ooooo 88      88ooooo 8P         88            88    88V8o 88 88   88 88ooooo  `8bd8'  
 *      `Y8b. 88~~~~~ 88      88~~~~~ 8b         88            88    88 V8o88 88   88 88~~~~~  .dPYb.  
 *    db   8D 88.     88booo. 88.     Y8b  d8    88           .88.   88  V888 88  .8D 88.     .8P  Y8. 
 *    `8888Y' Y88888P Y88888P Y88888P  `Y88P'    YP         Y888888P VP   V8P Y8888D' Y88888P YP    YP 
 *                                                                                                     
 *                                                                                                     
 */

  private _selectedIndex (item) {
    //This sends back the correct pivot category which matches the category on the tile.

    let itemKey = item.props.itemKey;

    this.setState({ selectedKey: itemKey, missingPage: CheckingSpinner });

    if ( itemKey === pivotHeading14 ) {
      // this.fetchMissingPage();
      setTimeout(() => this.fetchMissingPage() , 1);
    }

	}

  private async fetchMissingPage () {
    //This sends back the correct pivot category which matches the category on the tile.

    let missingPage = null;
    missingPage = await this.buildMissingPage( this.props.fetchInfo, 'Checking if these references do exist' );

		this.setState({ missingPage: missingPage, missingFetched: true });

	}


  /***
 *     .d88b.  d8b   db      d88888b d888888b db      d88888b       .o88b. db      d888888b  .o88b. db   dD 
 *    .8P  Y8. 888o  88      88'       `88'   88      88'          d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 
 *    88    88 88V8o 88      88ooo      88    88      88ooooo      8P      88         88    8P      88,8P   
 *    88    88 88 V8o88      88~~~      88    88      88~~~~~      8b      88         88    8b      88`8b   
 *    `8b  d8' 88  V888      88        .88.   88booo. 88.          Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. 
 *     `Y88P'  VP   V8P      YP      Y888888P Y88888P Y88888P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD 
 *                                                                                                          
 *                                                                                                          
 */

  private onFileClick( url: string ) : void {
    let e: any = event;
    url += e.altKey === true ? '&p=5' : '';
    window.open( url, 'none' );
  }

  private _closePanel ( )  {
    this.setState({ showPanel: false,});
	}

  private _showPanel ( panelFileType: IApprovedFileType, panelSource: ICDNCheck)  {

    this.setState({ 
      showPanel: true,
      panelFileType: panelFileType,
      panelSource: panelSource,
    
    });
	}

  private cancelSandBoxMode() {
    console.log('cancelSandBoxMode');
    this.props.turnSandboxOff();
    this.updateSandboxStatus( false );
  }

  private confirmSandBoxMode() {
    console.log('confirmSandBoxMode');
    this.props.turnSandboxOn();
    this.updateSandboxStatus( true );

  }

  private updateSandboxStatus( newStatus : boolean ) {
    this.setState( { currentlySandbox: newStatus, isDialogVisible: false } );

  }

  private toggleSandbox() {
    let newSetting = this.state.isDialogVisible === true ? false : true;
    this.setState( { isDialogVisible: newSetting } );
  }



  /***
 *    d888888b  .d88b.   d888b   d888b  db      d88888b .d8888. 
 *    `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'     88'  YP 
 *       88    88    88 88      88      88      88ooooo `8bo.   
 *       88    88    88 88  ooo 88  ooo 88      88~~~~~   `Y8b. 
 *       88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.     db   8D 
 *       YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P `8888Y' 
 *                                                              
 *                                                              
 */

  
   private showCacheInfo( ) : void {
    let newSetting = this.state.showCacheInfo === true ? false : true;
    this.setState( { showCacheInfo: newSetting } );
  }
  
  private async getShowCacheInfo( ) {
    let fetchInfo : IFetchInfo = this.state.fetchInfo;
    //Get cache info if it's not available
    if ( this.state.fetchInfo.cache.FileRef === '' ) {
      fetchInfo = JSON.parse(JSON.stringify( fetchInfo ));
      fetchInfo.cache = await getFileDetails( this.props.webPicker, this.props.libraryItemPicker );
      fetchInfo.cache.wasCached = this.props.fetchInfo.cache.wasCached;
      fetchInfo.cache.enableHTMLCache = this.props.fetchInfo.cache.enableHTMLCache;
    }

    this.setState( { showCacheInfo: true, fetchInfo: fetchInfo } );
  }

  
   private toggleClassicWarnHeight( ) : void {
    let newSetting = this.state.contextWarnClassic === null ? '12px' : null;
    this.setState( { contextWarnClassic: newSetting } );
  }

  
  private toggleModernWarnHeight( ) : void {
    let newSetting = this.state.contextWarnModern === null ? '12px' : null;
    this.setState( { contextWarnModern: newSetting } );
  }

  
   private hideClassicWarn( ) : void {
    this.setState( { contextWarnClassic: '0px' } );
  }

  
  private hideModernWarn( ) : void {
    this.setState( { contextWarnModern: '0px' } );
  }

  private togglePropsHelp(){
      let newState = this.state.showPropsHelp === true ? false : true;
      this.setState( { showPropsHelp: newState });
  }

  private toggleBlockWarnHeight( ) : void {
    let newSetting = this.state.fullBlockedHeight === true ? false : true;
    this.setState( { fullBlockedHeight: newSetting } );
  }

  private async toggleOriginal( ) {
    let newSetting = this.state.showOriginalHtml === true ? false : true;
    let fetchInfo : IFetchInfo = this.state.fetchInfo;

    //Get cache info if it's not available
    if ( this.state.fetchInfo.cache.FileRef === '' ) {
      fetchInfo = JSON.parse(JSON.stringify( fetchInfo ));
      fetchInfo.cache = await getFileDetails( this.props.webPicker, this.props.libraryItemPicker );
      fetchInfo.cache.wasCached = this.props.fetchInfo.cache.wasCached;
      fetchInfo.cache.enableHTMLCache = this.props.fetchInfo.cache.enableHTMLCache;
    }

    this.setState( { showOriginalHtml: newSetting, fetchInfo: fetchInfo  } );
  }

  private toggleLogic( ) : void {
    let showProfileLogic = this.state.showProfileLogic === true ? false : true;
    this.setState( { showProfileLogic: showProfileLogic } );
  }

  private toggleRaw( ) : void {
    let newSetting = this.state.showRawHTML === true ? false : true;
    this.setState( { showRawHTML: newSetting } );
  }

  private toggleTag( ) : void {
    let toggleTag : 'files' | 'tags' = this.state.toggleTag === 'files' ? 'tags' : 'files';
    this.setState( { toggleTag: toggleTag } );
  }

 }
