import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN , ICDNCheck, IFileTypeCDN } from './interface';
import { masterApprovedExternalCDNs, masterWarnExternalCDNs, masterBlockExternalCDNs, SecureProfile, jsCDNs, cssCDNs, imgCDNs, linkCDNs, htmlCDNs } from './ApprovedLibraries';


 export const masterCDNs: IFileTypeCDN = {
  approved: masterApprovedExternalCDNs,
  warn: masterWarnExternalCDNs,
  block: masterBlockExternalCDNs,
};

  export function createFileTypeSecurity( ext: string, icon: string, title: string, fileTypeCDN: IFileTypeCDN, text1: string = 'text1', text2: string = 'text2' ){
    
    //parsing this just to be sure it's not mutated
    let fullCDNs = JSON.parse(JSON.stringify(masterCDNs )) ;

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
  
  