import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN , ICDNCheck, IFileTypeCDN } from './interface';
import { masterApprovedExternalCDNs, masterWarnExternalCDNs, masterBlockExternalCDNs, SecureProfile, jsCDNs, cssCDNs, imgCDNs, linkCDNs, htmlCDNs } from './ApprovedLibraries';


 export const masterCDNs: IFileTypeCDN = {
  approved: masterApprovedExternalCDNs,
  warn: masterWarnExternalCDNs,
  block: masterBlockExternalCDNs,
};


/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d88888b d888888b db      d88888b      d888888b db    db d8888b. d88888b      
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88'       `88'   88      88'          `~~88~~' `8b  d8' 88  `8D 88'          
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88ooo      88    88      88ooooo         88     `8bd8'  88oodD' 88ooooo      
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88~~~      88    88      88~~~~~         88       88    88~~~   88~~~~~      
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88        .88.   88booo. 88.             88       88    88      88.          
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      YP      Y888888P Y88888P Y88888P         YP       YP    88      Y88888P      
 *                                                                                                                                       
 *                                                                                                                                       
 *    .d8888. d88888b  .o88b. db    db d8888b. d888888b d888888b db    db                                                                
 *    88'  YP 88'     d8P  Y8 88    88 88  `8D   `88'   `~~88~~' `8b  d8'                                                                
 *    `8bo.   88ooooo 8P      88    88 88oobY'    88       88     `8bd8'                                                                 
 *      `Y8b. 88~~~~~ 8b      88    88 88`8b      88       88       88                                                                   
 *    db   8D 88.     Y8b  d8 88b  d88 88 `88.   .88.      88       88                                                                   
 *    `8888Y' Y88888P  `Y88P' ~Y8888P' 88   YD Y888888P    YP       YP                                                                   
 *                                                                                                                                       
 *                                                                                                                                       
 */


  export function createFileTypeSecurity( ext: string, icon: string, title: string, fileTypeCDN: IFileTypeCDN, text1: string = 'text1', text2: string = 'text2' ){
    
    //parsing this just to be sure it's not mutated
    let fullCDNs = JSON.parse(JSON.stringify( masterCDNs )) ;

    if ( ext !== '*' ) {
      fileTypeCDN.approved.map( cdn => { fullCDNs.approved.push(cdn ) ; } );
      fileTypeCDN.warn.map( cdn => { fullCDNs.warn.push(cdn ) ; } );
      fileTypeCDN.block.map( cdn => { fullCDNs.block.push(cdn ) ; } );
    }

    let result : IFileTypeSecurity = {
      icon: icon,
      ext: ext,
      title: title != '' ? title : ext,
      text1: text1,
      text2: text2,
      counts: {
        Nothing: 0,
        SecureCDN: 0,
        Tenant: 0,
        ExternalApproved: 0,
        ExternalWarn: 0,
        WWW: 0,
        ExternalBlock: 0,
      },
      level: {
        warn: ext === '*' ? 'TBD' : SecureProfile[`${ext}Warn`],
        block: ext === '*' ? 'TBD' : SecureProfile[`${ext}Block`],
      },
      cdns: fullCDNs,
    };

    return result;

  }

  /***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b       .d8b.  d8888b. db    db      .d8888. d88888b  .o88b. db    db d8888b. d888888b d888888b db    db 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          d8' `8b 88  `8D 88    88      88'  YP 88'     d8P  Y8 88    88 88  `8D   `88'   `~~88~~' `8b  d8' 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88ooo88 88   88 Y8    8P      `8bo.   88ooooo 8P      88    88 88oobY'    88       88     `8bd8'  
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88~~~88 88   88 `8b  d8'        `Y8b. 88~~~~~ 8b      88    88 88`8b      88       88       88    
 *    Y8b  d8 88 `88. 88.     88   88    88    88.          88   88 88  .8D  `8bd8'       db   8D 88.     Y8b  d8 88b  d88 88 `88.   .88.      88       88    
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      YP   YP Y8888D'    YP         `8888Y' Y88888P  `Y88P' ~Y8888P' 88   YD Y888888P    YP       YP    
 *                                                                                                                                                            
 *                                                                                                                                                            
 *    d8888b. d8888b.  .d88b.  d88888b d888888b db      d88888b                                                                                               
 *    88  `8D 88  `8D .8P  Y8. 88'       `88'   88      88'                                                                                                   
 *    88oodD' 88oobY' 88    88 88ooo      88    88      88ooooo                                                                                               
 *    88~~~   88`8b   88    88 88~~~      88    88      88~~~~~                                                                                               
 *    88      88 `88. `8b  d8' 88        .88.   88booo. 88.                                                                                                   
 *    88      88   YD  `Y88P'  YP      Y888888P Y88888P Y88888P                                                                                               
 *                                                                                                                                                            
 *                                                                                                                                                            
 */


  //TenantCDN, warnExternalCDNs, blockExternalCDNs
  export function createAdvSecProfile () {
    let result :IAdvancedSecurityProfile = {
      sort: ['js', 'css', 'html', 'img', 'link', 'all' ],
      all: createFileTypeSecurity('*', '', 'All', masterCDNs ),
      js: createFileTypeSecurity('js', 'JS', '', jsCDNs ),
      css: createFileTypeSecurity('css', 'CSS', 'All', cssCDNs ),
      html: createFileTypeSecurity('html', 'FileHTML', 'All', htmlCDNs ),
      img: createFileTypeSecurity('img', 'Photo2', 'All', imgCDNs ),
      link: createFileTypeSecurity('link', 'Link', 'All', linkCDNs ),
    };

    return result;

  }
  
  