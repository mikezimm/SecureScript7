import * as React from 'react';
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';

import styles from './SecureScript7.module.scss';
import { ISecureScript7Props, ISecureScript7State } from './ISecureScript7Props';
import { escape } from '@microsoft/sp-lodash-subset';

import WebpartBanner from "./HelpPanel/banner/component";
import { IWebpartBannerProps, } from "./HelpPanel/banner/onNpm/bannerProps";
import { defaultBannerCommandStyles, } from "./HelpPanel/banner/onNpm/defaults";

export default class SecureScript7 extends React.Component<ISecureScript7Props, ISecureScript7State> {

  private currentPageUrl = this.props.pageContext.web.absoluteUrl + this.props.pageContext.site.serverRequestPath;
    
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



    let urlVars : any = this.props.urlVars;
    let debugMode = urlVars.debug === 'true' ? true : false;
    let isWorkbench = this.currentPageUrl.indexOf('_workbench.aspx') > 0 ? true : false;

    let showDevHeader = debugMode === true || isWorkbench === true ? true : false;

    this.state = { 
      showDevHeader: showDevHeader,
      lastStateChange: '',
      isSiteAdmin: null,
    };

  }

  public render(): React.ReactElement<ISecureScript7Props> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
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
      // <Icon iconName={layoutIcon} onClick={ this.toggleLayout.bind(this) } style={ defaultBannerCommandStyles }></Icon>,
    ];

    let bannerSuffix = '';
    //Exclude the props.bannerProps.title if the webpart is narrow to make more responsive
    let bannerTitle = this.props.bannerProps.bannerWidth < 900 ? bannerSuffix : `${this.props.bannerProps.title} - ${bannerSuffix}`;
    if ( bannerTitle === '' ) { bannerTitle = 'Pivot Tiles' ; }

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

      //2022-02-17:  Added these for expandoramic mode
      domElement = { this.props.bannerProps.domElement }
      enableExpandoramic = { this.props.bannerProps.enableExpandoramic }
      expandoDefault = { this.props.bannerProps.expandoDefault }
      expandoStyle = { this.props.bannerProps.expandoStyle}
      expandAlert = { this.props.bannerProps.expandAlert }
      expandConsole = { this.props.bannerProps.expandConsole }
      expandoPadding = { this.props.bannerProps.expandoPadding }

    ></WebpartBanner>;

    let devHeader = this.state.showDevHeader === true ? <div><b>Props: </b> { 'this.props.lastPropChange' + ', ' + 'this.props.lastPropDetailChange' } - <b>State: lastStateChange: </b> { this.state.lastStateChange  } </div> : null ;

    return (
      <section className={`${styles.secureScript7} ${hasTeamsContext ? styles.teams : ''}`}>
        { devHeader }
        { Banner }
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }
}
