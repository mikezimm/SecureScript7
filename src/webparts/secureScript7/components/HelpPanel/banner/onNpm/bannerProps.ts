import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';
import { PageContext } from '@microsoft/sp-page-context';
import { Panel, IPanelProps, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { IKeySiteProps } from './interfaces';

export interface IWebpartBannerProps {
	
	bannerWidth: number;
	title: string;
	panelTitle: string;
	styleString?: string;
	pageContext: PageContext;
	bannerReactCSS?: React.CSSProperties;
	bannerCommandStyles?: React.CSSProperties;
	earyAccess?: boolean; //Auto add early access warning in panel
	showBanner: boolean;
	showTricks: boolean; //This over-rides showBannerGear so it's always visible to this limited group.
	showBannerGear: boolean; //Show gear to SiteAdmins and SiteOwners (as determined by page context.)
	gitHubRepo: IRepoLinks; // replace with IRepoLinks from npmFunctions v0.1.0.3
	onHomePage: boolean; //Get from this.context on main webpart.
	showGoToHome: boolean;
	showGoToParent: boolean;

	//2022-02-17:  Added these for expandoramic mode
	domElement: HTMLElement; 
	enableExpandoramic: boolean;
	expandoDefault: boolean;
	expandoStyle: any;
	expandAlert: boolean;
	expandConsole: boolean;
	expandoPadding: number;
	//2022-02-17:  END additions for expandoramic mode

	wideToggle?: boolean; //enables panel width expander, true by default
	hoverEffect?: boolean; // applies fade in to full opacity on hover - true by default

	nearElements: any[];
	farElements: any[];

	exportProps: any;

}


export interface IWebpartBannerState {
	showPanel: boolean;
	showSettings: boolean;
	selectedKey: string;
	panelType: PanelType;
	keySiteProps: IKeySiteProps;
	expandoramicMode: boolean;

}

