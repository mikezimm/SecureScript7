import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN , ICDNCheck, IFileTypeCDN, SourceInfo } from './interface';
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

 export function buildSourceRankArray(){
  let SourceNameRank: ICDNCheck[] = SourceInfo.ranks.map( rank => {
      return rank.name;
  });

  return SourceNameRank;
}

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
        ExtApproved: 0,
        ExtWarn: 0,
        WWW: 0,
        ExtBlock: 0,
      },
      colors: [],
      level: {
        warn: ext === '*' ? 'TBD' : SecureProfile[`${ext}Warn`],
        block: ext === '*' ? 'TBD' : SecureProfile[`${ext}Block`],
      },
      cdns: fullCDNs,
    };


    //This is the overall ranks of the buckets from NOTHING to BLOCK as highest rank
    let SourceNameRank = buildSourceRankArray();

    let latestColor = 'green';

    SourceNameRank.map ( rankName => {
      if ( result.level.warn === rankName ) { latestColor = 'yellow' ; }
      if ( result.level.block === rankName ) { latestColor = 'red' ; }
      result.colors.push( latestColor);
    });

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
      js: createFileTypeSecurity('js', 'JS', 'js', jsCDNs ),
      css: createFileTypeSecurity('css', 'CSS', 'css', cssCDNs ),
      html: createFileTypeSecurity('html', 'FileHTML', 'html', htmlCDNs ),
      img: createFileTypeSecurity('img', 'Photo2', 'img', imgCDNs ),
      link: createFileTypeSecurity('link', 'Link', 'link', linkCDNs ),
    };

    return result;

  }
  
  