

export interface ISecureScript7WebPartProps {
    description: string;
  
    uniqueId: string;
    showBannerGear: boolean; // Not in Prop Pane
    
      //2022-02-17:  Added these for expandoramic mode
      enableExpandoramic: boolean;
      expandoDefault: boolean;
      expandoStyle: any;
    expandoPadding: number;
    
      // expandAlert: boolean;
      // expandConsole: boolean;
      //2022-02-17:  END additions for expandoramic mode
  
    // Section 15
    //General settings for Banner Options group
    // export interface IWebpartBannerProps {
      bannerTitle: string;
      bannerStyle: string;
      showBanner: boolean;
  
      showGoToHome: boolean;  //defaults to true
      showGoToParent: boolean;  //defaults to true
  
      bannerHoverEffect: boolean;
      showTricks: boolean;
    // }
  
    //Section 16 - FPS Options group
    searchShow: boolean;
    fpsPageStyle: string;
    fpsContainerMaxWidth: string;
    quickLaunchHide: boolean;
  
    //FPS Options part II
    pageHeaderHide: boolean;
    allSectionMaxWidthEnable: boolean;
    allSectionMaxWidth: number;
    allSectionMarginEnable: boolean;
    allSectionMargin: number;
    toolBarHide: boolean;

    //SecureScript Props for CE Code
    libraryPicker: string;
    libraryItemPicker: string;
  
  }
