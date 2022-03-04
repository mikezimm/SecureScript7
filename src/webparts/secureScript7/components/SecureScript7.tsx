import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import styles from './SecureScript7.module.scss';
import { ISecureScript7Props, ISecureScript7State } from './ISecureScript7Props';
import { escape } from '@microsoft/sp-lodash-subset';

import WebpartBanner from "./HelpPanel/banner/onLocal/component";
import { defaultBannerCommandStyles, } from "@mikezimm/npmfunctions/dist/HelpPanel/onNpm/defaults";
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { Pivot, PivotItem, IPivotItemProps, PivotLinkFormat, PivotLinkSize,} from 'office-ui-fabric-react/lib/Pivot';

import { IApprovedCDNs, IFetchInfo, ITagInfo, approvedFileTypes, approvedExternalCDNs, approvedSites, ISecurityProfile, SourceSecurityRank, 
  IApprovedFileType, ICDNCheck , warnExternalCDNs, blockExternalCDNs, SourceSecurityRankColor, SourceSecurityRankBackG, SourceSecurityRankIcons } from './ApprovedLibraries';


const stockPickerHTML = '<div class="tradingview-widget-container"><div id="tradingview"></div><div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener" target="_blank"><span class="blue-text">AAPL Chart</span></a> by TradingView</div><script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>      <script type="text/javascript">      new TradingView.widget(      {      "width": 980,      "height": 610,      "symbol": "NASDAQ:AAPL",      "interval": "D",      "timezone": "Etc/UTC",      "theme": "light",      "style": "1",      "locale": "en",      "toolbar_bg": "#f1f3f6",      "enable_publishing": false,      "allow_symbol_change": true,"container_id": "tradingview"});</script></div>';

const pivotHeading0 : ICDNCheck = 'ExternalBlock';  //2022-01-31: Added Pivot Tiles
const pivotHeading1 : ICDNCheck = 'ExternalWarn';  //Templates
const pivotHeading2 : ICDNCheck = 'Everything';  //Templates
const pivotHeading3 : ICDNCheck = 'ExternalApproved';  //Templates
const pivotHeading4 : ICDNCheck = 'Tenant';  //Templates
const pivotHeading5 : ICDNCheck = 'SecureCDN';  //Templates
const pivotHeading6 : ICDNCheck = 'Nothing';  //Templates
const pivotHeading7 : IApprovedFileType = 'js';  //Templates
const pivotHeading8 : IApprovedFileType = 'css';  //Templates
const pivotHeading9 : IApprovedFileType = 'html';  //Templates
const pivotHeading10 : IApprovedFileType = 'img';  //Templates
const pivotHeading11 : string = 'raw';  //Templates

export default class SecureScript7 extends React.Component<ISecureScript7Props, ISecureScript7State> {

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

  private tagPageNoteBlocks = 'BLOCKED due to their location.';
  private tagPageNoteWarns = 'High Risk location but still work.';
  private tagPageNoteEvery = '';
  private tagPageNoteExtApp = 'External locations that are approved';
  private tagPageNoteTenant = 'This Tenant but not in SecureCDN';
  private tagPageNoteSecure = 'the Tenant SecureCDN site';
  private tagPageNoteNothing = '';
  private tagPageNoteJS = 'Javascript Files';
  private tagPageNoteCSS = 'CSS Files';
  private tagPageNoteHTML = 'HTML Files';
  private tagPageNoteIMG = 'Image Files';

  private page0 = this.buildTagPage( this.props.fetchInfo.blocks, this.tagPageNoteBlocks ) ;
  private page1 = this.buildTagPage( this.props.fetchInfo.warns, this.tagPageNoteWarns );
  private page2 = this.buildTagPage( this.props.fetchInfo.every, this.tagPageNoteEvery );
  private page3 = this.buildTagPage( this.props.fetchInfo.extApp, this.tagPageNoteExtApp );
  private page4 = this.buildTagPage( this.props.fetchInfo.tenant, this.tagPageNoteTenant );
  private page5 = this.buildTagPage( this.props.fetchInfo.secure, this.tagPageNoteSecure );
  private page6 = this.buildTagPage( this.props.fetchInfo.nothing, this.tagPageNoteNothing );

  private page7 = this.buildTagPage( this.props.fetchInfo.js, this.tagPageNoteJS );
  private page8 = this.buildTagPage( this.props.fetchInfo.css, this.tagPageNoteCSS );
  private page9 = this.buildTagPage( this.props.fetchInfo.html, this.tagPageNoteHTML );
  private page10 = this.buildTagPage( this.props.fetchInfo.img, this.tagPageNoteIMG );

  private pivotBlocked = <PivotItem headerText={'Blocked'} ariaLabel={pivotHeading0} title={pivotHeading0} itemKey={pivotHeading0} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading0)] }/>;
  private pivotWarn = <PivotItem headerText={'Warn'} ariaLabel={pivotHeading1} title={pivotHeading1} itemKey={pivotHeading1} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading1)] }/>;
  private pivotEvery = <PivotItem headerText={'Every'} ariaLabel={pivotHeading2} title={pivotHeading2} itemKey={pivotHeading2} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading2)] }/>;
  private pivotExtApp = <PivotItem headerText={'ExtApp'} ariaLabel={pivotHeading3} title={pivotHeading3} itemKey={pivotHeading3} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading3)] }/>;
  private pivotTenant = <PivotItem headerText={'Tenant'} ariaLabel={pivotHeading4} title={pivotHeading4} itemKey={pivotHeading4} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading4)] }/>;
  private pivotSecure = <PivotItem headerText={'Secure'} ariaLabel={pivotHeading5} title={pivotHeading5} itemKey={pivotHeading5} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading5)] }/>;
  private pivotNothing = <PivotItem headerText={ 'Nothing' } ariaLabel={pivotHeading6} title={pivotHeading6} itemKey={pivotHeading6} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading6)] }/>;

  private pivotJS = <PivotItem headerText={ null } ariaLabel={pivotHeading7} title={pivotHeading7} itemKey={pivotHeading7} itemIcon={ 'JS' }/>;
  private pivotCSS = <PivotItem headerText={ null } ariaLabel={pivotHeading8} title={pivotHeading8} itemKey={pivotHeading8} itemIcon={ 'CSS' }/>;
  private pivotHTML = <PivotItem headerText={ null } ariaLabel={pivotHeading9} title={pivotHeading9} itemKey={pivotHeading9} itemIcon={ 'FileHTML' }/>;
  private pivotIMG = <PivotItem headerText={ null } ariaLabel={pivotHeading10} title={pivotHeading10} itemKey={pivotHeading10} itemIcon={ 'Photo2' }/>;
  private pivotRAW = <PivotItem headerText={ 'raw' } ariaLabel={'raw'} title={'raw'} itemKey={'raw'} itemIcon={ 'Embed' }/>;


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

    return [
      // <Icon iconName='Search' onClick={ this.searchMe.bind(this) } style={ defaultBannerCommandStyles }></Icon>,
      // <Icon iconName='ChromeMinimize' onClick={ this.minimizeTiles.bind(this) } style={ defaultBannerCommandStyles }></Icon>,
      // <Icon iconName='ClearFilter' onClick={ this.showAll.bind(this) } style={ defaultBannerCommandStyles }></Icon>,
    ];
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
    };

  }

  public componentDidUpdate(prevProps){

    if ( prevProps.fetchInstance !== this.props.fetchInstance ) {

      this.page0 = this.buildTagPage( this.props.fetchInfo.blocks, this.tagPageNoteBlocks ) ;
      this.page1 = this.buildTagPage( this.props.fetchInfo.warns, this.tagPageNoteWarns );
      this.page2 = this.buildTagPage( this.props.fetchInfo.every, this.tagPageNoteEvery );
      this.page3 = this.buildTagPage( this.props.fetchInfo.extApp, this.tagPageNoteExtApp );
      this.page4 = this.buildTagPage( this.props.fetchInfo.tenant, this.tagPageNoteTenant );
      this.page5 = this.buildTagPage( this.props.fetchInfo.secure, this.tagPageNoteSecure );
      this.page6 = this.buildTagPage( this.props.fetchInfo.nothing, this.tagPageNoteNothing );
    
      this.page7 = this.buildTagPage( this.props.fetchInfo.js, this.tagPageNoteJS );
      this.page8 = this.buildTagPage( this.props.fetchInfo.css, this.tagPageNoteCSS );
      this.page9 = this.buildTagPage( this.props.fetchInfo.html, this.tagPageNoteHTML );
      this.page10 = this.buildTagPage( this.props.fetchInfo.img, this.tagPageNoteIMG );

      this._updateStateOnPropsChange({});
    }

  //   //alert('componentDidUpdate 1');

  //   console.log( 'CDU:  LAST-STATE-CHANGE:', this.props.lastPropDetailChange, this.state.lastStateChange );

  //   let rebuildTiles : boolean = false;

  //   let reloadData : boolean = false;

  //   let theTrigger : any = null;

  //   if ( prevProps.lastPropChange === this.props.lastPropChange ) { 
  //     //Then check individual props
  //     if (this.props.setFilter !== prevProps.setFilter) {  reloadData = true ; theTrigger = 'setFilter'; }  
  //     else if (this.props.filterTitle !== prevProps.filterTitle) {  reloadData = true ; theTrigger = 'filterTitle'; }  
  //     else if (this.props.filterDescription !== prevProps.filterDescription) {  reloadData = true ; theTrigger = 'filterDescription'; }  
  //     else if (this.props.filterEverything !== prevProps.filterEverything) {  reloadData = true ; theTrigger = 'filterEverything'; }  
  //     else if (this.props.listDefinition !== prevProps.listDefinition) {  reloadData = true ; theTrigger = 'listDefinition'; }  
  //     else if (this.props.listWebURL !== prevProps.listWebURL) {  reloadData = true ; theTrigger = 'listWebURL'; }  
  //     else if (this.props.listTitle !== prevProps.listTitle) {  reloadData = true ; theTrigger = 'listTitle'; }  
  //     else if ( JSON.stringify(this.props.custCategories) !== JSON.stringify(prevProps.custCategories)) {  reloadData = true ; theTrigger = 'custCategories'; }    
  //     else if (this.props.ignoreList !== prevProps.ignoreList) {  reloadData = true ; theTrigger = 'ignoreList'; }    
  //     else if ( JSON.stringify(this.props.fetchInfo) !== JSON.stringify(prevProps.fetchInfo) ) {  reloadData = true ; theTrigger = 'fetchInfo'; }

  //     console.log( 'CDU: theTrigger section 1:', theTrigger );

  //     if (this.props.setTab !== prevProps.setTab) {  rebuildTiles = true ; }
  //     else if (this.props.setSize !== prevProps.setSize) {  rebuildTiles = true ; theTrigger = 'setSize'; }
  //     else if (this.props.showHero !== prevProps.showHero) {  rebuildTiles = true ; theTrigger = 'showHero'; }
  //     else if (this.props.heroType !== prevProps.heroType) {  rebuildTiles = true ; theTrigger = 'heroType'; }
  //     else if (this.props.setRatio !== prevProps.setRatio) {  rebuildTiles = true ; theTrigger = 'setRatio'; }
  //     else if (this.props.setMaxWidth !== prevProps.setMaxWidth ) {  rebuildTiles = true ; theTrigger = 'setMaxWidth'; }
      
  //     else if (this.props.setImgFit !== prevProps.setImgFit) {  rebuildTiles = true ; theTrigger = 'setImgFit'; }
  //     else if (this.props.setImgCover !== prevProps.setImgCover) {  rebuildTiles = true ; theTrigger = 'setImgCover'; }
  //     else if (this.props.heroCategory !== prevProps.heroCategory) {  rebuildTiles = true ; theTrigger = 'heroCategory'; }
  //     else if (this.props.heroRatio !== prevProps.heroRatio) {  rebuildTiles = true ; theTrigger = 'heroRatio'; }
  //     else if (this.props.searchShow !== prevProps.searchShow) {  rebuildTiles = true ; theTrigger = 'heroRatio'; }

  //     console.log( 'CDU: theTrigger section 2:', theTrigger );

  //   } else if ( prevProps.lastPropChange !== this.props.lastPropChange ) {
  //     if ( this.props.lastPropChange === 'cats' ) { reloadData = true ; theTrigger = 'cats'; } 
  //     else if ( this.props.lastPropChange === 'filters' ) { reloadData = true ; theTrigger = 'filters'; } 
  //     else if ( this.props.lastPropChange === 'groups' ) { reloadData = true ; theTrigger = 'groups'; } 
  //     else if ( this.props.lastPropChange === 'hubs' ) { reloadData = true ; theTrigger = 'hubs'; } 
  //     else if ( this.props.lastPropChange === 'items' ) { reloadData = true ; theTrigger = 'items'; } 
  //     else if ( this.props.lastPropChange === 'lists' ) { reloadData = true ; theTrigger = 'lists'; } 
  
  //     else if ( this.props.lastPropChange === 'subs' ) { reloadData = true ; theTrigger = 'subs'; } 
  //     else if ( this.props.lastPropChange === 'styles' ) { rebuildTiles = true ; theTrigger = 'styles'; } 
  //     else if ( this.props.lastPropChange === 'sizes' ) { rebuildTiles = true ; theTrigger = 'sizes'; } 
  //     else if ( this.props.lastPropChange === 'heros' ) { rebuildTiles = true ; theTrigger = 'heros'; } 
  //     else if ( this.props.lastPropChange === 'init' ) { rebuildTiles = true ; theTrigger = 'init'; } 
  //     else if ( this.props.lastPropChange === 'other' ) { rebuildTiles = true ; theTrigger = 'other'; } 
  //     console.log( 'CDU: theTrigger section 3:', theTrigger );
  //   }
  //   if ( this.props.lastPropChange === 'expando' ) { rebuildTiles = true ; theTrigger = 'expando'; } 
    
  //   /* 
  //   */

  //   // if (this.props.fetchInfo !== prevProps.fetchInfo) {  reloadData = true ; }

  //   /**
  //    * hubs changing are the only complicated situation because Hubs require secondary call to fetch all site icons
  //    */
  //   let wasHubChange : any = false;
  //   if (this.props.fetchInfo !== prevProps.fetchInfo) {
  //     Object.keys(this.props.fetchInfo).map( key => {
  //       if ( JSON.stringify(this.props.fetchInfo[key]) !== JSON.stringify(prevProps.fetchInfo[key]) ) { console.log('thisFetchInfoProp Changed: ' + key, this.props.fetchInfo[key] ) ; }
  //     });

  //     changeHubs.map( change => {
  //       if ( this.props.fetchInfo[change] !== prevProps.fetchInfo[change] ) { wasHubChange = true ; }
  //     }) ;
  //   }

  //   if ( wasHubChange === true || this.state.lastStateChange !== 'updateStateHubs' ) {
  //     if ( reloadData === true ) {
  //       console.log('CDU reloadData: ', wasHubChange, wasHubChange, this.state.lastStateChange, theTrigger );
  //       this._getListItems( this.props.custCategories );
  
  //     } else if (rebuildTiles === true) {
  //       console.log('CDU rebuildTiles: ', wasHubChange, rebuildTiles, this.state.lastStateChange, theTrigger );
  //       this._updateStateOnPropsChange({});
  //     }

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
      fetchInfo,
    } = this.props;

    const {
      toggleTag,
    } = this.state;

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
    if ( bannerTitle === '' ) { bannerTitle = 'Pivot Tiles' ; }

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
    
    let blockHTML = null;
    if ( fetchInfo.selectedKey === 'ExternalBlock' ) {
      blockHTML = <div style={{ padding: '10px', background: 'yellow' }}>
        <h2>Some content could not be loaded because it was blocked for security reasons</h2>
        <ul>
          <li>Click the 'Show Code' button in the upper right to see which files are blocked.</li>
          <li>Provided the html file is in a valid location, it and all content not considered blocked will show below.</li>
          <li>However, NO javascript code will execute until the blocked code is resolved.</li>
        </ul>
      </div>;
    }

    if ( this.state.showOriginalHtml ) {
      let directLink = <a href={ this.props.fileRelativeUrl } target='none'>{ this.props.libraryItemPicker }</a>;

      // const pivotHeading0 : ICDNCheck | IApprovedFileType = 'ExternalBlock';  //2022-01-31: Added Pivot Tiles
      // const pivotHeading1 : ICDNCheck | IApprovedFileType = 'ExternalWarn';  //Templates
      // const pivotHeading2 : ICDNCheck | IApprovedFileType = 'Everything';  //Templates
      // const pivotHeading3 : ICDNCheck | IApprovedFileType = 'ExternalApproved';  //Templates
      // const pivotHeading4 : ICDNCheck | IApprovedFileType = 'Tenant';  //Templates
      // const pivotHeading5 : ICDNCheck | IApprovedFileType = 'SecureCDN';  //Templates
      // const pivotHeading6 : ICDNCheck | IApprovedFileType = 'Nothing';  //Templates
      // const pivotHeading7 : ICDNCheck | IApprovedFileType = 'js';  //Templates
      // const pivotHeading8 : ICDNCheck | IApprovedFileType = 'css';  //Templates
      // const pivotHeading9 : ICDNCheck | IApprovedFileType = 'html';  //Templates
      // const pivotHeading10 : ICDNCheck | IApprovedFileType = 'img';  //Templates

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
        if ( this.state.selectedKey === 'raw' ) { thisPage = <div>{ fetchInfo.snippet }</div> ; }

        let pivotItems: any [] = [];

        if ( fetchInfo.blocks.length > 0 ) { pivotItems.push( this.pivotBlocked ); }
        if ( fetchInfo.warns.length > 0 ) { pivotItems.push( this.pivotWarn ); }
        if ( fetchInfo.every.length > 0 ) { pivotItems.push( this.pivotEvery ); }
        if ( fetchInfo.extApp.length > 0 ) { pivotItems.push( this.pivotExtApp ); }
        if ( fetchInfo.tenant.length > 0 ) { pivotItems.push( this.pivotTenant ); }
        if ( fetchInfo.secure.length > 0 ) { pivotItems.push( this.pivotSecure ); }
        if ( fetchInfo.nothing.length > 0 ) { pivotItems.push( this.pivotNothing ); }
    
        if ( fetchInfo.js.length > 0 ) { pivotItems.push( this.pivotJS ); }
        if ( fetchInfo.css.length > 0 ) { pivotItems.push( this.pivotCSS ); }
        if ( fetchInfo.html.length > 0 ) { pivotItems.push( this.pivotHTML ); }
        if ( fetchInfo.img.length > 0 ) { pivotItems.push( this.pivotIMG ); }
        if ( fetchInfo.snippet ) { pivotItems.push( this.pivotRAW ); }

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
      showBannerGear={ this.props.bannerProps.showBannerGear }
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

    return (
      <section className={`${styles.secureScript7} ${hasTeamsContext ? styles.teams : ''}`}>
        { devHeader }
        { Banner }
        { blockHTML }
        { originalInfo }
        { actualElement }
      </section>
    );
  }

  private buildTagPage( tagsInfo: ITagInfo[], message: any ) {
    let files = tagsInfo.map( tag => {
        return <div style={{paddingTop: '5px'}}>{ tag.file }</div>;
    });

    let tags = tagsInfo.map( tag => {
      let parts = tag.tag.split( tag.file );
      return <div style={{paddingTop: '5px'}}>{`${ parts[0] }`}<b>{`${ tag.file }`}</b>{`${ parts[1] }`}</div>;
    });

    let messageDiv = <div style={{ paddingBottom:"10px", fontWeight: 'bold'}}>{message}</div>;
    let result = {
      files: <div style={{ minHeight: '25vh', padding: '15px 20px 20px 20px'}}>{ messageDiv  }{ files }</div>,
      tags: <div style={{ minHeight: '25vh', padding: '15px 20px 20px 20px'}}>{ messageDiv  }{ tags }</div>,
      message: <div>{message}</div>
    };

    return result;

  }

  private _selectedIndex = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

		let itemKey = item.props.itemKey;

		this.setState({ selectedKey: itemKey });
		
	}

  private onFileClick( url: string ) : void {
    let e: any = event;
    url += e.altKey === true ? '&p=5' : '';
    window.open( url, 'none' );
  }

  private toggleOriginal( ) : void {
    let newSetting = this.state.showOriginalHtml === true ? false : true;
    this.setState( { showOriginalHtml: newSetting } );
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
