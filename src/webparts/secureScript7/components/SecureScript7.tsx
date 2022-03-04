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
      toggleTag: 'file',
      selectedKey: this.props.fetchInfo.selectedKey,
    };

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
        if ( this.state.selectedKey === pivotHeading0 ) { thisPage = this.buildTagPage( fetchInfo.blocks ) ; } else 
        if ( this.state.selectedKey === pivotHeading1 ) { thisPage = this.buildTagPage( fetchInfo.warns ); } else 
        if ( this.state.selectedKey === pivotHeading2 ) { thisPage = this.buildTagPage( fetchInfo.every ); } else 
        if ( this.state.selectedKey === pivotHeading3 ) { thisPage = this.buildTagPage( fetchInfo.extApp ); } else 
        if ( this.state.selectedKey === pivotHeading4 ) { thisPage = this.buildTagPage( fetchInfo.tenant ); } else 
        if ( this.state.selectedKey === pivotHeading5 ) { thisPage = this.buildTagPage( fetchInfo.secure ); } else 
        if ( this.state.selectedKey === pivotHeading6 ) { thisPage = this.buildTagPage( fetchInfo.nothing ); } else 

        if ( this.state.selectedKey === pivotHeading7 ) { thisPage = this.buildTagPage( fetchInfo.js ); } else 
        if ( this.state.selectedKey === pivotHeading8 ) { thisPage = this.buildTagPage( fetchInfo.css ); } else 
        if ( this.state.selectedKey === pivotHeading9 ) { thisPage = this.buildTagPage( fetchInfo.html ); } else 
        if ( this.state.selectedKey === pivotHeading10 ) { thisPage = this.buildTagPage( fetchInfo.img ); } else 
        if ( this.state.selectedKey === 'raw' ) { thisPage = <div>{ fetchInfo.snippet }</div> ; }

        let pivotItems: any [] = [];

        if ( fetchInfo.blocks.length > 0 ) { pivotItems.push( <PivotItem headerText={'Blocked'} ariaLabel={pivotHeading0} title={pivotHeading0} itemKey={pivotHeading0} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading0)] }/> ); }
        if ( fetchInfo.warns.length > 0 ) { pivotItems.push( <PivotItem headerText={'Warn'} ariaLabel={pivotHeading1} title={pivotHeading1} itemKey={pivotHeading1} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading1)] }/> ); }
        if ( fetchInfo.every.length > 0 ) { pivotItems.push( <PivotItem headerText={'Every'} ariaLabel={pivotHeading2} title={pivotHeading2} itemKey={pivotHeading2} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading2)] }/> ); }
        if ( fetchInfo.extApp.length > 0 ) { pivotItems.push( <PivotItem headerText={'ExtApp'} ariaLabel={pivotHeading3} title={pivotHeading3} itemKey={pivotHeading3} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading3)] }/> ); }
        if ( fetchInfo.tenant.length > 0 ) { pivotItems.push( <PivotItem headerText={'Tenant'} ariaLabel={pivotHeading4} title={pivotHeading4} itemKey={pivotHeading4} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading4)] }/> ); }
        if ( fetchInfo.secure.length > 0 ) { pivotItems.push( <PivotItem headerText={'Sec'} ariaLabel={pivotHeading5} title={pivotHeading5} itemKey={pivotHeading5} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading5)] }/> ); }
        if ( fetchInfo.nothing.length > 0 ) { pivotItems.push( <PivotItem headerText={ 'Nothing' } ariaLabel={pivotHeading6} title={pivotHeading6} itemKey={pivotHeading6} itemIcon={ SourceSecurityRankIcons[SourceSecurityRank.indexOf(pivotHeading6)] }/> ); }
    
        if ( fetchInfo.js.length > 0 ) { pivotItems.push( <PivotItem headerText={ null } ariaLabel={pivotHeading7} title={pivotHeading7} itemKey={pivotHeading7} itemIcon={ 'JS' }/> ); }
        if ( fetchInfo.css.length > 0 ) { pivotItems.push( <PivotItem headerText={ null } ariaLabel={pivotHeading8} title={pivotHeading8} itemKey={pivotHeading8} itemIcon={ 'CSS' }/> ); }
        if ( fetchInfo.html.length > 0 ) { pivotItems.push( <PivotItem headerText={ null } ariaLabel={pivotHeading9} title={pivotHeading9} itemKey={pivotHeading9} itemIcon={ 'FileHTML' }/> ); }
        if ( fetchInfo.img.length > 0 ) { pivotItems.push( <PivotItem headerText={ null } ariaLabel={pivotHeading10} title={pivotHeading10} itemKey={pivotHeading10} itemIcon={ 'Photo2' }/> ); }
        if ( fetchInfo.snippet ) { pivotItems.push( <PivotItem headerText={ 'raw' } ariaLabel={'raw'} title={'raw'} itemKey={'raw'} itemIcon={ 'Embed' }/> ); }

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
        <h2 style={{ color: 'darkblue' }}>This is the original html { this.toggleRawIcon } { this.state.showRawHTML === false ? null : this.state.toggleTag === 'file' ? this.toggleTagFile : this.toggleTagTag }</h2>
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

    let actualElement = errorUnapprovedComponent ?  errorUnapprovedComponent :
      // <div ref={ (el) => {}} dangerouslySetInnerHTML={{ __html: scriptHTML }}></div>;
      <div ref={ (el) => { 
        el.innerHTML = scriptHTML;
      }} ></div>;

    let devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { 'this.props.lastPropChange' + ', ' + 'this.props.lastPropDetailChange' } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;

    return (
      <section className={`${styles.secureScript7} ${hasTeamsContext ? styles.teams : ''}`}>
        { devHeader }
        { Banner }
        
        { originalInfo }
        { actualElement }
        

      </section>
    );
  }

  private buildTagPage( tags: ITagInfo[] ) {
    let rows = tags.map( tag => {
      let parts = tag.tag.split( tag.file );
      if ( this.state.toggleTag === 'file' ) {
        return <div style={{paddingTop: '5px'}}>{ tag.file }</div>;
      } else {
        return <div style={{paddingTop: '5px'}}>{`${ parts[0] }`}<b>{`${ tag.file }`}</b>{`${ parts[1] }`}</div>;
      }
      
    });

    return <div style={{ minHeight: '25vh', padding: '15px 20px 20px 20px'}}>{ rows }</div>;

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
    let toggleTag : 'file' | 'tag' = this.state.toggleTag === 'file' ? 'tag' : 'file';
    this.setState( { toggleTag: toggleTag } );
  }

 }
