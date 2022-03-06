import { IAdvancedSecurityProfile, IFileTypeSecurity, TenantCDN } from './interface';
import { warnExternalCDNs, blockExternalCDNs } from './ApprovedLibraries';

  export function createFileTypeSecurity( ext: string, icon: string, title: string, approved:string[], warn:string[], block:string[], text1: string = 'text1', text2: string = 'text2' ){
  
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
      cdns: {
        approved: approved,
        warn: warn,
        block: block,
      }
    };
  
    return result;
  
  }
  //TenantCDN, warnExternalCDNs, blockExternalCDNs
  function createAdvSecProfile () {
    let result :IAdvancedSecurityProfile = {
      sort: ['js', 'css', 'html', 'img', 'link', 'all' ],
      all: createFileTypeSecurity('*', '', 'All', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
      js: createFileTypeSecurity('js', 'JS', '', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
      css: createFileTypeSecurity('css', 'CSS', 'All', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
      html: createFileTypeSecurity('html', 'FileHTML', 'All', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
      img: createFileTypeSecurity('img', 'Photo2', 'All', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
      link: createFileTypeSecurity('link', '', 'All', [TenantCDN + '/'], warnExternalCDNs, blockExternalCDNs ),
  
    };
  
    return result;
    
  }
  
  