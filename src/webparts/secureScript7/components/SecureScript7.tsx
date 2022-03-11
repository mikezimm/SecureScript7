import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import styles from './SecureScript7.module.scss';
import { ISecureScript7Props, ISecureScript7State } from './ISecureScript7Props';
import { escape } from '@microsoft/sp-lodash-subset';

import { DisplayMode, Version } from '@microsoft/sp-core-library';
import { Panel, IPanelProps, PanelType } from 'office-ui-fabric-react/lib/Panel';

import ReactJson from "react-json-view";

import WebpartBanner from "./HelpPanel/banner/onLocal/component";
import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';
import { approvedSites, SecureProfile, } from './Security20/ApprovedLibraries';

import { createAdvSecProfile } from './Security20/functions';  //securityProfile: IAdvancedSecurityProfile,

import { IApprovedCDNs, IFetchInfo, ITagInfo, IApprovedFileType, ICDNCheck , IPolicyFlag, IPolicyFlagLevel, SourceInfo, IAdvancedSecurityProfile, IFileTypeSecurity, PolicyFlagStyles  } from './Security20/interface';
import { analyzeShippet  } from './Security20/FetchCode';

import { SourceNothing,
      SourceSecure,
      SourceLocal,
      SourceTenant,
      SourceExtApp,
      SourceWWW,
      SourceVerify,
      SourceExtWarn,
      SourceBlock, } from './Security20/interface';

import { buildSourceRankArray,  } from './Security20/functions';
import { tdProperties } from 'office-ui-fabric-react';

const stockPickerHTML = '<div class="tradingview-widget-container"><div id="tradingview"></div><div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div><script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>      <script type="text/javascript">      new TradingView.widget(      {      "width": 980,      "height": 610,      "symbol": "NASDAQ:AAPL",      "interval": "D",      "timezone": "Etc/UTC",      "theme": "light",      "style": "1",      "locale": "en",      "toolbar_bg": "#f1f3f6",      "enable_publishing": false,      "allow_symbol_change": true,"container_id": "tradingview"});</script></div>';

const pivotHeading0 : ICDNCheck = 'ExtBlock';  //2022-01-31: Added Pivot Tiles
const pivotHeading1 : ICDNCheck = 'ExtWarn';  //Templates
const pivotHeading2 : ICDNCheck = 'WWW';  //Templates
const pivotHeadingV : ICDNCheck = 'Verify';  //Templates
const pivotHeading3 : ICDNCheck = 'ExtApproved';  //Templates
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

  private toggleRawIcon = <Icon iconName={ 'FileCode' } onClick={ this.toggleRaw.bind(this) } style={ defaultBannerCommandStyles } title='Show Raw HTML here'></Icon>;
  private toggleTagFile = <Icon iconName={ 'TextField' } onClick={ this.toggleTag.bind(this) } style={ defaultBannerCommandStyles } title='Show Raw HTML here'></Icon>;
  private toggleTagTag = <Icon iconName={ 'Tag' } onClick={ this.toggleTag.bind(this) } style={ defaultBannerCommandStyles } title='Show Raw HTML here'></Icon>;

  private tagPageNoteBlocks = 'Files BLOCKED due to a policy.';
  private tagPageNoteWarns = 'Files in High Risk locations (due to a policy) but still work.';
  private tagPageNoteWWW = 'Files elsewhere in the www.  Not blocked and not approved';
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
        <li>We can and do occasional audits to verify compliance with the terms of use.</li>
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


  private page0 = this.buildTagPage( this.props.fetchInfo.blocks, this.tagPageNoteBlocks, this.props.fetchInfo.policyFlags.block ) ;
  private page1 = this.buildTagPage( this.props.fetchInfo.warns, this.tagPageNoteWarns, this.props.fetchInfo.policyFlags.warn );
  private page2 = this.buildTagPage( this.props.fetchInfo.www, this.tagPageNoteWWW );
  private page3 = this.buildTagPage( this.props.fetchInfo.extApp, this.tagPageNoteExtApp );
  private page4 = this.buildTagPage( this.props.fetchInfo.tenant, this.tagPageNoteTenant );
  private page5 = this.buildTagPage( this.props.fetchInfo.secure, this.tagPageNoteSecure );
  private page6 = this.buildTagPage( this.props.fetchInfo.nothing, this.tagPageNoteNothing );

  private page7 = this.buildTagPage( this.props.fetchInfo.js, this.tagPageNoteJS );
  private page8 = this.buildTagPage( this.props.fetchInfo.css, this.tagPageNoteCSS );
  private page9 = this.buildTagPage( this.props.fetchInfo.html, this.tagPageNoteHTML );
  private page10 = this.buildTagPage( this.props.fetchInfo.img, this.tagPageNoteIMG );
  private page11 = this.buildTagPage( this.props.fetchInfo.link, this.tagPageNoteLINK );
  
  private pageL = this.buildTagPage( this.props.fetchInfo.local, this.tagPageNoteLOCAL );
  private pageV = this.buildTagPage( this.props.fetchInfo.verify, this.tagPageNoteVERIFY, [], 'verify' );


  private pivotBlocked = <PivotItem headerText={'Blocked'} ariaLabel={pivotHeading0} title={pivotHeading0} itemKey={pivotHeading0} itemIcon={ SourceBlock.icon }/>;
  private pivotWarn = <PivotItem headerText={'Warn'} ariaLabel={pivotHeading1} title={pivotHeading1} itemKey={pivotHeading1} itemIcon={ SourceExtWarn.icon }/>;
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
      farElements.push( <Icon iconName='DownloadDocument' onClick={ this.getEntirePage.bind(this) } style={ defaultBannerCommandStyles }></Icon> );
    }
    return farElements;
  }


  public constructor(props:ISecureScript7Props){
      super(props);
    console.log('SecureScript7: constructor', this.toggleRawIcon);


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
      fullBlockedHeight: true,
      showProfileLogic: false,
      showPanel: false,
      panelFileType: 'all',
      panelSource: 'TBD',
      fetchInfo: this.props.fetchInfo,
    };

  }

  public componentDidUpdate(prevProps){

    if ( prevProps.fetchInstance !== this.props.fetchInstance ) {
      this.setStateFetchInfo( this.props.fetchInfo );
    }

  }

  private setStateFetchInfo( fetchInfo: IFetchInfo ) {

    this.page0 = this.buildTagPage( fetchInfo.blocks, this.tagPageNoteBlocks, fetchInfo.policyFlags.block ) ;
    this.page1 = this.buildTagPage( fetchInfo.warns, this.tagPageNoteWarns, fetchInfo.policyFlags.warn );
    this.page2 = this.buildTagPage( fetchInfo.www, this.tagPageNoteWWW );
    this.page3 = this.buildTagPage( fetchInfo.extApp, this.tagPageNoteExtApp );
    this.page4 = this.buildTagPage( fetchInfo.tenant, this.tagPageNoteTenant );
    this.page5 = this.buildTagPage( fetchInfo.secure, this.tagPageNoteSecure );
    this.page6 = this.buildTagPage( fetchInfo.nothing, this.tagPageNoteNothing );
  
    this.page7 = this.buildTagPage( fetchInfo.js, this.tagPageNoteJS );
    this.page8 = this.buildTagPage( fetchInfo.css, this.tagPageNoteCSS );
    this.page9 = this.buildTagPage( fetchInfo.html, this.tagPageNoteHTML );
    this.page10 = this.buildTagPage( fetchInfo.img, this.tagPageNoteIMG );
    this.page11 = this.buildTagPage( fetchInfo.link, this.tagPageNoteLINK );

    this.pageL = this.buildTagPage( fetchInfo.local, this.tagPageNoteLOCAL );
    this.pageV = this.buildTagPage( fetchInfo.verify, this.tagPageNoteVERIFY, [], 'verify' );

    let selectedKey = fetchInfo.selectedKey;

    this.setState({ 
      fetchInfo: fetchInfo,
      fullBlockedHeight: true,
      showProfileLogic: false,
      showPanel: false,
      panelFileType: 'all',
      panelSource: 'TBD',
      selectedKey: selectedKey,
     });
  }
  
  private async getEntirePage() {
    let htmlFragment = document.documentElement.innerHTML;
    let times = new Date();
    let securityProfile: IAdvancedSecurityProfile = createAdvSecProfile();  //This is required to reset all the counts
    const fetchInfo: IFetchInfo = await analyzeShippet( htmlFragment , times, times, securityProfile  );
    fetchInfo.selectedKey = this.state.selectedKey;
    this.setStateFetchInfo( fetchInfo );
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

  private _updateStateOnPropsChange(params: any ): void {

  }

  
  public render(): React.ReactElement<ISecureScript7Props> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,

    } = this.props;

    const {
      fetchInfo,
      toggleTag,
      showPanel,
      panelFileType,
      panelSource,
    } = this.state;

    let securityProfile:  IAdvancedSecurityProfile = fetchInfo.securityProfile;
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


    // let farBannerElementsArray = [];
    let farBannerElementsArray = [...this.farBannerElements,
      this.props.showCodeIcon !== true ? null : <Icon iconName={ 'Code' } onClick={ this.toggleOriginal.bind(this) } style={ defaultBannerCommandStyles }></Icon>,
    ];

    let bannerSuffix = '';
    //Exclude the props.bannerProps.title if the webpart is narrow to make more responsive
    let bannerTitle = this.props.bannerProps.bannerWidth < 900 ? bannerSuffix : `${this.props.bannerProps.title} - ${bannerSuffix}`;
    if ( bannerTitle === '' ) { bannerTitle = 'Secure Script 7' ; }
    if ( this.props.displayMode === DisplayMode.Edit ) { bannerTitle += ' JS Disabled during Edit' ; }

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
    if ( fetchInfo.selectedKey === 'ExtBlock' ) {
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

        if ( this.state.selectedKey === 'raw' ) { thisPage = <div>{ fetchInfo.snippet }</div> ; }
        if ( this.state.selectedKey === pivotHeading13 ) { 
          thisPage = <div>
            { this.getProfilePage() }
          </div> ;
         }

        let pivotItems: any [] = [];

        if ( fetchInfo.blocks.length > 0 ) { pivotItems.push( this.pivotBlocked ); }
        if ( fetchInfo.warns.length > 0 ) { pivotItems.push( this.pivotWarn ); }
        if ( fetchInfo.verify.length > 0 ) { pivotItems.push( this.pivotVerify ); }
        if ( fetchInfo.www.length > 0 ) { pivotItems.push( this.pivotWWW ); }
        if ( fetchInfo.extApp.length > 0 ) { pivotItems.push( this.pivotExtApp ); }
        if ( fetchInfo.tenant.length > 0 ) { pivotItems.push( this.pivotTenant ); }
        if ( fetchInfo.local.length > 0 ) { pivotItems.push( this.pivotLocal ); }
        if ( fetchInfo.secure.length > 0 ) { pivotItems.push( this.pivotSecure ); }
        if ( fetchInfo.nothing.length > 0 ) { pivotItems.push( this.pivotNothing ); }
    
        if ( fetchInfo.js.length > 0 ) { pivotItems.push( this.pivotJS ); }
        if ( fetchInfo.css.length > 0 ) { pivotItems.push( this.pivotCSS ); }
        if ( fetchInfo.html.length > 0 ) { pivotItems.push( this.pivotHTML ); }
        if ( fetchInfo.img.length > 0 ) { pivotItems.push( this.pivotIMG ); }
        if ( fetchInfo.link.length > 0 ) { pivotItems.push( this.pivotLINK ); }
        if ( fetchInfo.snippet ) { pivotItems.push( this.pivotRAW ); }

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

      let libViewerLink = <span onClick={() => this.onFileClick( encodeDecodeString(this.props.libraryPicker, 'decode') )} style={{ color: 'blue' , cursor: 'pointer' }}> [ open library ]</span>;

      let fileViewerhref = `${this.props.libraryPicker}/Forms/AllItems.aspx?id=${ this.props.fileRelativeUrl }&parent=${this.props.libraryPicker}`;
      let fileViewerLink = <span onClick={() => this.onFileClick( fileViewerhref )} style={{ color: 'blue' , cursor: 'pointer' }} > [ open file in editor ]</span>;
      originalInfo = <div style={{ background: '#dddd', padding: '10px 20px 40px 20px',  }}>
        <h2 style={{ color: 'darkblue' }}>This is the original html { this.toggleRawIcon } { this.state.showRawHTML === false ? null : this.state.toggleTag === 'files' ? this.toggleTagFile : this.toggleTagTag }</h2>
        <ul>
          <li><b>Library:</b>{ ` ${this.props.libraryPicker}` } { libViewerLink } </li>
          <li><b>File:</b> { this.props.libraryItemPicker} {  fileViewerLink }  </li>
        </ul>
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
      exportProps={ this.props.bannerProps.exportProps }
      showBanner={ this.props.bannerProps.showBanner }
      bannerWidth={ this.props.bannerProps.bannerWidth }
      pageContext={ this.props.bannerProps.pageContext }
      title ={ bannerTitle }
      panelTitle = { this.props.bannerProps.panelTitle }
      bannerReactCSS={ this.props.bannerProps.bannerReactCSS }
      bannerCommandStyles={ defaultBannerCommandStyles }
      showTricks={ this.props.bannerProps.showTricks }
      showGoToParent={ this.props.bannerProps.showGoToParent }
      showGoToHome={ this.props.bannerProps.showGoToHome }
      onHomePage={ this.props.bannerProps.onHomePage }

      webpartHistory={ this.props.webpartHistory }
      
      showBannerGear={ this.props.bannerProps.showBannerGear }
      
      showFullPanel={ this.props.bannerProps.showFullPanel }
      replacePanelHTML={ this.props.bannerProps.replacePanelHTML }
      replacePanelWarning={ this.props.bannerProps.replacePanelWarning }

      hoverEffect={ this.props.bannerProps.hoverEffect }
      gitHubRepo={ this.props.bannerProps.gitHubRepo }
      earyAccess={ this.props.bannerProps.earyAccess }
      wideToggle={ this.props.bannerProps.wideToggle }
      nearElements = { this.nearBannerElements }
      farElements = { farBannerElementsArray }

      showRepoLinks={ this.props.bannerProps.showRepoLinks }
      showExport={ this.props.bannerProps.showExport }
      //2022-02-17:  Added these for expandoramic mode
      domElement = { this.props.bannerProps.domElement }
      enableExpandoramic = { this.props.bannerProps.enableExpandoramic }
      expandoDefault = { this.props.bannerProps.expandoDefault }
      expandoStyle = { this.props.bannerProps.expandoStyle}
      expandAlert = { this.props.bannerProps.expandAlert }
      expandConsole = { this.props.bannerProps.expandConsole }
      expandoPadding = { this.props.bannerProps.expandoPadding }

    ></WebpartBanner>;

    let actualElement = <div></div>;

    let devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { 'this.props.lastPropChange' + ', ' + 'this.props.lastPropDetailChange' } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;

    let termsOfUse = fetchInfo == null || fetchInfo.snippet.length === 0 ? this.termsOfUse : null;
    


    let bannerPanel = null;

    if ( showPanel === true ) {
      let currentCDNs = [];
      let currentFiles = [];

      ['approved','warn','block'].map( cdn => {
        if ( securityProfile[ panelFileType].cdns[ cdn ].length > 0 ) {
          securityProfile[ panelFileType].cdns[ cdn ].map( ( url, idx ) => {
            currentCDNs.push( <tr><td>{ idx }</td><td>{ cdn }</td><td>{ url }</td></tr> );
          });
        }
      });

      let panelContent = <div className={ styles.policyPanel } style={ null }>
        <div style={{fontSize: 'larger', fontWeight: 'bold' }}>Policies for { panelFileType }</div>
        <table>
          { currentCDNs }
        </table>
        { panelSource }
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
        { Banner }
        { blockHTML }
        { originalInfo }
        { termsOfUse }
        { actualElement }
        { bannerPanel }
      </section>
    );
  }


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
          <li>Blocked &gt; Warned &gt; Approved  &gt; SecureCDN  &gt; Local  &gt; Tenant  &gt; WWW</li>
        </ul>
        <li>Items marked as Verify may also be found in other categories.  They just have some anomoly that was detected.</li>
      </ul>
    </div>

  </div>;

  SourceInfo.ranks.map( rank => {
    headings.push( <th>{ rank.name } </th> );
  });

  rows.push( <tr>{ headings } </tr>  );

  this.props.securityProfile.sort.map( typeExt => {
    let cells: any[] = [];
    let thisType: IFileTypeSecurity = this.props.securityProfile[typeExt];
    let cdns: string | number = thisType.cdns.approved.length +thisType.cdns.warn.length  +thisType.cdns.block.length ;
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


  private buildTagPage( tagsInfo: ITagInfo[], message: any, policyFlags: IPolicyFlag[] = [], special: 'verify' | '' = '' ) {

    let files = tagsInfo.map( ( tag, idx ) => {
      // return <tr><td>{ idx }</td><td>{ tag.level }</td><td>{ tag.type }</td><td>{ tag.file }</td></tr>;
      let policyFlagStyle = PolicyFlagStyles[ tag.policyFlags.level ];
      let level = special === 'verify' ? tag.policyFlags.verify.join(' ') : tag.policyFlags.level;
      const newStyle = this.getColorStyle( policyFlagStyle.color );
      let openIcon = <Icon iconName={ 'OpenFile' } onClick={ () => { window.open( tag.file, '_none') ; } } style={ newStyle } title={`Open file: ${tag.file}`}></Icon>;
      return <tr style={{color: policyFlagStyle.color }}><td>{ idx }</td><td style={{ whiteSpace: 'nowrap'}}>{ level }</td><td>{ tag.type }</td><td>{ openIcon }</td><td>{ tag.file }</td></tr>;
    });

    let fileTable = <table>
        { files }
      </table>;

    let tags = tagsInfo.map( ( tag, idx ) => {
      let parts = tag.tag.split( tag.fileOriginal );
      // let color = this.getTagColor( tag.policyFlags.level ) ;
      let policyFlagStyle = PolicyFlagStyles[ tag.policyFlags.level ];
      let tagCell = <td>{`${ parts[0] }`}<b>{`${ tag.fileOriginal }`}</b>{`${ parts[1] }`}</td>;
      let level = special === 'verify' ? tag.policyFlags.verify.join(' ') : tag.policyFlags.level;
      const newStyle = this.getColorStyle( policyFlagStyle.color );
      let openIcon = <Icon iconName={ 'OpenFile' } onClick={ () => { window.open( tag.file, '_none') ; } } style={ newStyle } title={`Open file: ${tag.file}`}></Icon>;
      // return <tr style={{color: policyFlagStyle.color }}><td>{ idx }</td><td style={{ whiteSpace: 'nowrap'}}>{ level }</td><td>{ tag.type }</td><td>{ openIcon }</td>{ tagCell }</tr>;
      return <tr style={{color: policyFlagStyle.color }}><td>{ idx }</td><td style={ null }>{ level }</td><td>{ tag.type }</td><td>{ openIcon }</td>{ tagCell }</tr>;
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

    let messageDiv = <div style={{ fontWeight: 'bold', display: 'grid' }}>{ `${message} - ( ${ tagsInfo.length } )` }</div>;
    let result = {
      files: <div className = { styles.policies } >{ policyMessage  }{ messageDiv  }{ fileTable }</div>,
      tags: <div className = { styles.policies } >{ policyMessage  }{ messageDiv  }{ tagTable }</div>,
      message: <div>{message}</div>
    };

    return result;

  }


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


  private getColorStyle ( color: string ) {
    return {
      backgroundColor: 'transparent',
      color: color,
      padding: '3px',
      fontSize: '17px',
      margin: '0',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'normal',
    };

  }
  private goToFile() {


  }

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

  private _selectedIndex = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

		let itemKey = item.props.itemKey;

		this.setState({ selectedKey: itemKey });
		
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

  private toggleBlockWarnHeight( ) : void {
    let newSetting = this.state.fullBlockedHeight === true ? false : true;
    this.setState( { fullBlockedHeight: newSetting } );
  }

  private toggleOriginal( ) : void {
    let newSetting = this.state.showOriginalHtml === true ? false : true;
    this.setState( { showOriginalHtml: newSetting } );
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
