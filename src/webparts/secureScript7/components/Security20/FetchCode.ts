
import * as React from 'react';

import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

import { Icon, ITag, mergeOverflows } from 'office-ui-fabric-react';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";


import { approvedSites, } from './ApprovedLibraries';

import { IApprovedCDNs, IFetchInfo, ITagInfo, ISecurityProfile, SourceSecurityRank, 
  IApprovedFileType, ICDNCheck , SourceSecurityRankColor, SourceSecurityRankBackG, SourceSecurityRankIcons, approvedFileTypes, IAdvancedSecurityProfile, IFileTypeSecurity, IPolicyFlag, IPolicyFlags, SourceInfo, IPolicyFlagLevel } from './interface';

/***
 *    d8888b. d88888b  d888b  d88888b db    db 
 *    88  `8D 88'     88' Y8b 88'     `8b  d8' 
 *    88oobY' 88ooooo 88      88ooooo  `8bd8'  
 *    88`8b   88~~~~~ 88  ooo 88~~~~~  .dPYb.  
 *    88 `88. 88.     88. ~8~ 88.     .8P  Y8. 
 *    88   YD Y88888P  Y888P  Y88888P YP    YP 
 *                                             
 *                                             
 */

// let scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
// let scriptSrcRegex = /<script.+?src=[\"'](.+?)[\"'].*?>/gi;
// let linkHrefRegex = /<link.+?href=[\"'](.+?)[\"'].*?>/gi;
export const srcRegex = /src=[\"'](.+?)[\"'].*?/gi;

export const hrefRegex = /href=[\"'](.+?)[\"'].*?/gi;

// //This gets all js src tags that are .js
// let srcJSRegex = /src=[\"'](.+?).js[\"'].*?/gi;

//This looks for src=*.js in script tag
//For this, get group and just add .js
//
export const srcJSRegex2 = /<script[\s\S]src=[\"'](.+?).js[\"'].*?<\/script>/gi;

//This checks for this type of tag
//<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
export const srcJSRegex3 = /<script[\s\S].+?src=[\"'](.+?).js[\"'].*?<\/script>/gi;

// //This gets all js src tags that are .js
export const hrefCSSRegex = /href=[\"'](.+?).css[\"'].*?/gi;

//This looks for href=*.css file within link tag
//For this, get group and just add .css
export const hrefCSSRegex2 = /<link[\s\S]*?href=[\"'](.+?).css[\"'].*?>/gi;

//This gets all js src tags that are .js
//For this, get match and then look for src tag to get the extension
export const imgSrcRegex = /<img[\s\S]*?src=[\"'](.+?)\.(jpg|jpeg|png|webp|avif|gif|svg)[\"'].*?>/gi;

//This gets all a tags and finds the hrefs in them
//For this, get match and then look for src tag to get the extension
export const linkSrcRegex = /<a[\s\S]*?href=[\"'](.+?)[\"'].*?>/gi;

//This gets all a tags and finds the hrefs in them
//For this, get match and then look for src tag to get the extension

//These look for attributes with the closing tag, which is not always the case
// export const linkHrefRegex = /<a[\s\S]*?href=[\"'](.+?)[\"'].*?<\/a>/gi;
// export const linkHrefSingleQuoteRegex = /<a[\s\S]*?href\=[\"](.+?)[\"].*?<\/a>/gi;
// export const linkHrefDoubleQuoteRegex = /<a[\s\S]*?href\=['](.+?)['].*?<\/a>/gi;

//These look for attributes and just look for closing the opening tag
export const linkHrefRegex = /<a[\s\S]*?href=[\"'](.+?)[\"'].*?>/gi;
export const linkHrefSingleQuoteRegex = /<a[\s\S]*?href\=\"[(.+?)\"].*?>/gi;
export const linkHrefDoubleQuoteRegex = /<a[\s\S]*?href\='(.+?)'.*?>/gi;

export const linkHref2SingleQuoteRegex = /<a.*?href\=''.*?>/gi;
export const linkHref2DoubleQuoteRegex = /<a.*?href\=\"\".*?>/gi;

export const hrefEqualDoubleQuotes = /href=\".*?\"/gi;
export const hrefEqualSingleQuotes = /href='.*?'/gi;
export const linkOpenCloseRegex = /<a.*?href=.*?>/gi;
/***
 *    d8888b.  .d8b.  .d8888. d88888b      d88888b d88888b d888888b  .o88b. db   db      d888888b d8b   db d88888b  .d88b.  
 *    88  `8D d8' `8b 88'  YP 88'          88'     88'     `~~88~~' d8P  Y8 88   88        `88'   888o  88 88'     .8P  Y8. 
 *    88oooY' 88ooo88 `8bo.   88ooooo      88ooo   88ooooo    88    8P      88ooo88         88    88V8o 88 88ooo   88    88 
 *    88~~~b. 88~~~88   `Y8b. 88~~~~~      88~~~   88~~~~~    88    8b      88~~~88         88    88 V8o88 88~~~   88    88 
 *    88   8D 88   88 db   8D 88.          88      88.        88    Y8b  d8 88   88        .88.   88  V888 88      `8b  d8' 
 *    Y8888P' YP   YP `8888Y' Y88888P      YP      Y88888P    YP     `Y88P' YP   YP      Y888888P VP   V8P YP       `Y88P'  
 *                                                                                                                          
 *                                                                                                                          
 */


export function baseFetchInfo( warning: string ) {
    let base: IFetchInfo = {
        snippet: '',
        selectedKey: 'raw',
        errorHTML: warning,
        js: [],
        css: [],
        img: [],
        link: [],
        html: [],
        preFetchTime: 0,
        postFetchTime: 0,
        postRegexTime: 0,
        fetchTime: 0,
        regexTime: 0,
        nothing:[],
        secure:[],
        local:[],
        tenant:[],
        extApp:[],
        warns:[],
        blocks:[],
        verify: [],
        www:[],
        policyFlags: {
            warn: [],
            block: [],
            none: [],
            verify: [],
        },
    };

    return base;

}

/***
 *    d88888b d88888b d888888b  .o88b. db   db      .d8888. d8b   db d888888b d8888b.      .88b  d88. d888888b db   dD d88888b 
 *    88'     88'     `~~88~~' d8P  Y8 88   88      88'  YP 888o  88   `88'   88  `8D      88'YbdP`88   `88'   88 ,8P' 88'     
 *    88ooo   88ooooo    88    8P      88ooo88      `8bo.   88V8o 88    88    88oodD'      88  88  88    88    88,8P   88ooooo 
 *    88~~~   88~~~~~    88    8b      88~~~88        `Y8b. 88 V8o88    88    88~~~        88  88  88    88    88`8b   88~~~~~ 
 *    88      88.        88    Y8b  d8 88   88      db   8D 88  V888   .88.   88           88  88  88   .88.   88 `88. 88.     
 *    YP      Y88888P    YP     `Y88P' YP   YP      `8888Y' VP   V8P Y888888P 88           YP  YP  YP Y888888P YP   YD Y88888P 
 *                                                                                                                             
 *                                                                                                                             
 */

export function buildSourceRankArray(){
    let SourceNameRank: ICDNCheck[] = SourceInfo.ranks.map( rank => {
        return rank.name;
    });

    return SourceNameRank;
}

export async function fetchSnippetMike( context: any, webUrl: string, libraryPicker: string , libraryItemPicker: string , securityProfile: IAdvancedSecurityProfile  ) {

    //This is just a handy array of Rank Names in order to get rank index:  SourceInfo
    let SourceNameRank: ICDNCheck[] = buildSourceRankArray();

    if ( !webUrl || webUrl.length < 1 ) {
        console.log('fetchSnippetMike Err 0:', webUrl, libraryPicker, libraryItemPicker );
        return baseFetchInfo( '<div style="height: 50, width: \'100%\'">Web URL is not valid.</div>' ) ;
    } else if ( !libraryPicker || libraryPicker.length < 1 ) {
        console.log('fetchSnippetMike Err 1:', webUrl, libraryPicker, libraryItemPicker );
        return baseFetchInfo( '<div style="height: 50, width: \'100%\'">Select a valid library.</div>') ;
    } else if ( !libraryItemPicker || libraryItemPicker.length < 1 ) {
        console.log('fetchSnippetMike Err 2:', webUrl, libraryPicker, libraryItemPicker );
        return baseFetchInfo( '<div style="height: 50, width: \'100%\'">Select a valid Filename.</div>' );
    }

    if ( webUrl === '' ) { webUrl = '/sites/SecureCDN'; }

    let fileURL = libraryPicker + "/" + libraryItemPicker;

    const snippetURLQuery = webUrl + `/_api/web/getFileByServerRelativeUrl('${fileURL}')/$value`;

    console.log('fetchSnippetMike: webUrl', webUrl );
    console.log('fetchSnippetMike: fileURL', fileURL );

    let preFetchTime = new Date();

    const htmlFragment = await context.spHttpClient.get(snippetURLQuery, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => response.text());

    // console.log('fetchSnippetMike: htmlFragment', htmlFragment );

    let postFetchTime = new Date();


/***
 *              d888888b  .d8b.   d888b       d888888b d8888b. d88888b d8b   db d888888b d888888b d88888b db    db 
 *              `~~88~~' d8' `8b 88' Y8b        `88'   88  `8D 88'     888o  88 `~~88~~'   `88'   88'     `8b  d8' 
 *                 88    88ooo88 88              88    88   88 88ooooo 88V8o 88    88       88    88ooo    `8bd8'  
 *                 88    88~~~88 88  ooo         88    88   88 88~~~~~ 88 V8o88    88       88    88~~~      88    
 *                 88    88   88 88. ~8~        .88.   88  .8D 88.     88  V888    88      .88.   88         88    
 *                 YP    YP   YP  Y888P       Y888888P Y8888D' Y88888P VP   V8P    YP    Y888888P YP         YP    
 *                                                                                                                 
 *                                                                                                                 
 */


    let cleanHtmlFragment = htmlFragment.replace('\\\"','"').replace('\n','').replace('\r','');

    let scriptTags2 = cleanHtmlFragment.match(srcJSRegex2);
    let scriptTags3 = cleanHtmlFragment.match(srcJSRegex3);
    let scriptTags = scriptTags2 ? scriptTags2 : [];
    //This will add scriptTags3 into scriptTags if it's not null
    if ( scriptTags3 ) { scriptTags3.map( tag => { scriptTags.push( tag ) ; });}

    let scripts : ITagInfo[] = scriptTags === null ? [] : scriptTags.map( tag => { 
        let matchTag = tag.match(srcRegex);
        let fileOriginal= matchTag === null ? '' : matchTag[0];
        let createTag = matchTag === null ? '' : matchTag[0].replace('src="',"").replace('"',"");
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'js', createTag, fileOriginal, securityProfile.js, SourceNameRank ,'<scr src=*.js' );
        return tagInfo;
    });

    let cssTags = cleanHtmlFragment.match(hrefCSSRegex2);
    let css : ITagInfo[] = cssTags === null ? [] : cssTags.map( tag => { 
        let matchTag = tag.match(hrefCSSRegex);
        let fileOriginal= matchTag === null ? '' : matchTag[0];
        let createTag = matchTag === null ? '' : matchTag[0].replace('href="',"").replace('"',"");
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'css', createTag, fileOriginal, securityProfile.css, SourceNameRank, 'href=*.css'  );
        return tagInfo;
    });

    let imgTags = cleanHtmlFragment.match(imgSrcRegex);
    let img : ITagInfo[] = imgTags === null ? [] : imgTags.map( tag => { 
        let matchTag = tag.match(srcRegex);
        let fileOriginal= matchTag === null ? '' : matchTag[0];
        let createTag = matchTag === null ? '' : matchTag[0].replace('src="',"").replace('\"','"');
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'img', createTag , fileOriginal, securityProfile.img, SourceNameRank, 'src=""');
        return tagInfo;
    });

    let linkTags = cleanHtmlFragment.match(linkOpenCloseRegex);
    let link : ITagInfo[] = linkTags === null ? [] : linkTags.map( tag => { 

        // export const hrefRegex = /href=[\"'](.+?)[\"'].*?/gi;
        // export const hrefEqualDoubleQuotes = /href=\".*?\"/gi;
        // export const hrefEqualSingleQuotes = /href='.*?'/gigi;
        // export const linkOpenCloseRegex = /<a.*?href=.*?>/gi;

        let fileOriginal = '';
        let createTag = '';
        let matchTag1 = tag.match(hrefEqualDoubleQuotes);
        let matchTag2 = tag.match(hrefEqualSingleQuotes);
        let foundRegex = null;

        if ( matchTag1 !== null ) {
            fileOriginal=  matchTag1[0];
            createTag =  matchTag1[0].replace('href="',"").replace('"',"");
            foundRegex = 'href="x"';
        } else if ( matchTag2 !== null ) {
            fileOriginal=  matchTag2[0];
            createTag = matchTag2[0].replace("href='","").replace("'","");
            foundRegex = "href='x'";
        } else {
            alert(`Strange Tag: ${tag}` );
        }

        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'link', createTag , fileOriginal, securityProfile.link, SourceNameRank, foundRegex );
        return tagInfo;
    });

/***
 *              d8888b.  .d88b.  db      d888888b  .o88b. db    db      .d8888. db    db .88b  d88. .88b  d88.  .d8b.  d8888b. db    db 
 *              88  `8D .8P  Y8. 88        `88'   d8P  Y8 `8b  d8'      88'  YP 88    88 88'YbdP`88 88'YbdP`88 d8' `8b 88  `8D `8b  d8' 
 *              88oodD' 88    88 88         88    8P       `8bd8'       `8bo.   88    88 88  88  88 88  88  88 88ooo88 88oobY'  `8bd8'  
 *              88~~~   88    88 88         88    8b         88           `Y8b. 88    88 88  88  88 88  88  88 88~~~88 88`8b      88    
 *              88      `8b  d8' 88booo.   .88.   Y8b  d8    88         db   8D 88b  d88 88  88  88 88  88  88 88   88 88 `88.    88    
 *              88       `Y88P'  Y88888P Y888888P  `Y88P'    YP         `8888Y' ~Y8888P' YP  YP  YP YP  YP  YP YP   YP 88   YD    YP    
 *                                                                                                                                      
 *                                                                                                                                      
 */

    let policyFlags: IPolicyFlags = {
        warn: [],
        block: [],
        verify: [],
        none: [],
    };

    let policyKeys: string[] = [];
    [...scripts, ...css, ...img, ...link ].map ( tag => {
        if ( tag.policyFlags.level !== 'none' && policyKeys.indexOf( tag.policyFlags.key ) < 0 ) {
            policyKeys.push( tag.policyFlags.key );
            policyFlags[ tag.policyFlags.level ].push( tag.policyFlags );
        }
    });

    let postRegexTime = new Date();

/***
 *              d88888b d88888b d888888b  .o88b. db   db      d888888b d8b   db d88888b  .d88b.       d8888b. db    db d888888b db      d8888b. 
 *              88'     88'     `~~88~~' d8P  Y8 88   88        `88'   888o  88 88'     .8P  Y8.      88  `8D 88    88   `88'   88      88  `8D 
 *              88ooo   88ooooo    88    8P      88ooo88         88    88V8o 88 88ooo   88    88      88oooY' 88    88    88    88      88   88 
 *              88~~~   88~~~~~    88    8b      88~~~88         88    88 V8o88 88~~~   88    88      88~~~b. 88    88    88    88      88   88 
 *              88      88.        88    Y8b  d8 88   88        .88.   88  V888 88      `8b  d8'      88   8D 88b  d88   .88.   88booo. 88  .8D 
 *              YP      Y88888P    YP     `Y88P' YP   YP      Y888888P VP   V8P YP       `Y88P'       Y8888P' ~Y8888P' Y888888P Y88888P Y8888D' 
 *                                                                                                                                              
 *                                                                                                                                              
 */

    let result :  IFetchInfo= {
        selectedKey: 'raw',
        snippet: htmlFragment,
        errorHTML: '',
        js: scripts,
        css: css,
        img: img,
        link: link,
        html:[],
        preFetchTime: preFetchTime.getTime(),
        postFetchTime: postFetchTime.getTime(),
        postRegexTime: postRegexTime.getTime(),
        fetchTime: postFetchTime.getTime() - preFetchTime.getTime(),
        regexTime: postRegexTime.getTime() - postFetchTime.getTime(),
        nothing: [],
        secure: [],
        local: [],
        tenant: [],
        extApp: [],
        warns: [],
        blocks: [],
        verify: [],
        www: [],
        policyFlags: policyFlags,
    };

    let allTags = [ ...scripts, ...css, ...img, ...link ];

    //export const SourceSecurityRank:   ICDNCheck[] = [ 'Nothing' ,     'SecureCDN' ,          'Local',            'Tenant' ,          'ExternalApproved' ,  'ExternalWarn',   'Verify',     'WWW' ,  'ExternalBlock' ];
    allTags.map( tag => {
        if ( tag.rank === 0 ) { result.nothing.push( tag ) ; } else
        if ( tag.rank === 1 ) { result.secure.push( tag ) ; } else
        if ( tag.rank === 2 ) { result.local.push( tag ) ; } else
        if ( tag.rank === 3 ) { result.tenant.push( tag ) ; } else
        if ( tag.rank === 4 ) { result.extApp.push( tag ) ; } else
        if ( tag.rank === 5 ) { result.warns.push( tag ) ; } else
        if ( tag.rank === 6 ) { result.verify.push( tag ) ; } else
        if ( tag.rank === 7 ) { result.www.push( tag ) ; } else
        if ( tag.rank === 8 ) { result.blocks.push( tag ) ; }

        //This will catch everything previously put in other arrays like 
        if ( tag.rank !== 6 && tag.policyFlags.verify.length > 0 ) { result.verify.push( tag ) ; }

    });

    // CHECK WHY THIS DOES NOT GIVE VERIFY TAB ANY MORE
    ///SecureScriptTesting/Gulpy/SitePages/Site-Audit-Test.aspx?debug=true&noredir=true&debugManifestsFile=https%3a//localhost%3a4321/temp/manifests.js

    //This determines the default tab selected in Code Pane Tags
    if ( result.blocks.length > 0 ) { result.selectedKey = 'ExternalBlock' ; } else
    if ( result.warns.length > 0 ) { result.selectedKey = 'ExternalWarn' ; } else
    if ( result.verify.length > 0 ) { result.selectedKey = 'Verify' ; } else
    if ( result.www.length > 0 ) { result.selectedKey = 'WWW' ; } else
    if ( result.extApp.length > 0 ) { result.selectedKey = 'ExternalApproved' ; } else
    if ( result.local.length > 0 ) { result.selectedKey = 'Local' ; } else
    if ( result.secure.length > 0 ) { result.selectedKey = 'SecureCDN' ; } else
    if ( result.nothing.length > 0 ) { result.selectedKey = 'Nothing' ; }

    console.log( 'fetch results: ', result );
    console.log( 'fetch policyFlags: ', policyFlags );
    return result;

}


/***
 *     .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      d888888b  .d8b.   d888b       d888888b d8b   db d88888b  .d88b.       d888888b d888888b d88888b .88b  d88. 
 *    d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          `~~88~~' d8' `8b 88' Y8b        `88'   888o  88 88'     .8P  Y8.        `88'   `~~88~~' 88'     88'YbdP`88 
 *    8P      88oobY' 88ooooo 88ooo88    88    88ooooo         88    88ooo88 88              88    88V8o 88 88ooo   88    88         88       88    88ooooo 88  88  88 
 *    8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~         88    88~~~88 88  ooo         88    88 V8o88 88~~~   88    88         88       88    88~~~~~ 88  88  88 
 *    Y8b  d8 88 `88. 88.     88   88    88    88.             88    88   88 88. ~8~        .88.   88  V888 88      `8b  d8'        .88.      88    88.     88  88  88 
 *     `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P         YP    YP   YP  Y888P       Y888888P VP   V8P YP       `Y88P'       Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                                                                                                                     
 *                                                                                                                                                                     
 */


//This will get all instances of '+' except any '++' or '+=' or '+-'
export const regexJustPlus = /[^\+]\+[^\+\=\-]/gi;
export const regexJustEqual = /[^\+][^href]\=/gi;
export const regexPlusPlus = /\+\+/gi;
export const regexPlusMinus = /\+\-/gi;
export const regexPlusEqual = /\+\=/gi;


export function createBaseTagInfoItem( tag: string, type: IApprovedFileType, file: string, fileOriginal: string, SecureFileProfile: IFileTypeSecurity, SourceNameRank: ICDNCheck[], regex: any ) {
    let styleRegex = /style=[\"'](.+?)[\"'].*?/gi;
    let styleTagCheck = tag.match(styleRegex);
    let styleTag = styleTagCheck === null ? '' : styleTagCheck[0];
    let lcFile = file.toLowerCase();
    let policyFlags: IPolicyFlag = { cdn: '', level: 'none', type: type, key: `none`, verify: [] };


    /**
     * 
     * The order of getting the rank below needs to be executed in the same order as this.
        export const SourceInfo : ISourceRank = {
            ranks: [
            SourceNothing,
            SourceSecure,
            SourceLocal,
            SourceTenant,
            SourceExtApp,
            SourceWWW,
            SourceVerify,
            SourceExtWarn,
            SourceBlock,
            ]
        };

     */

    let fileLocaton : ICDNCheck = 'TBD';

    let warnOrBlock = { fileLocaton: fileLocaton as ICDNCheck, policyFlags: policyFlags } ;

    warnOrBlock = isLocationWarnBlock( lcFile, warnOrBlock.fileLocaton, SecureFileProfile, type, warnOrBlock.policyFlags, 'block' );
    warnOrBlock = isLocationWarnBlock( lcFile, warnOrBlock.fileLocaton, SecureFileProfile, type, warnOrBlock.policyFlags, 'warn' );

    fileLocaton = warnOrBlock.fileLocaton;
    policyFlags = warnOrBlock.policyFlags;

    fileLocaton = isLocationSecure( lcFile, fileLocaton );
    fileLocaton = isLocationLocal( lcFile, fileLocaton );
    fileLocaton = isLocationTenant( lcFile, fileLocaton );
    fileLocaton = isLocationExtApp( lcFile, fileLocaton, SecureFileProfile );

    if ( file.match(regexJustPlus) !== null ) { policyFlags.verify.push( '+' ) ; }
    if ( file.match(regexPlusPlus) !== null ) { policyFlags.verify.push( '++' ) ; }
    if ( file.match(regexPlusMinus) !== null  ) { policyFlags.verify.push( '+-' ) ; }
    if ( file.match(regexPlusEqual) !== null ) { policyFlags.verify.push( '+=' ) ; }
    if ( file.match(regexJustEqual) !== null ) { policyFlags.verify.push( '=' ) ; }
    if ( tag.length > 255 ) { policyFlags.verify.push( 'length' ) ; }

    if ( policyFlags.verify.length > 0 && policyFlags.level === 'none' ) { 
        policyFlags.level = 'verify';
    }

    if ( fileLocaton === 'TBD' && policyFlags.level === 'verify' ) { 
        fileLocaton = 'Verify';
    } else if ( fileLocaton === 'TBD' ){
        fileLocaton = 'WWW';
    }

    //Found an example where image file had extra " at the end of the string.
    //"<img style="padding-left:20px;vertical-align:text-bottom" src="https://tenant.sharepoint.com/sites/CRS/Templates/icons/SharePointParentSiteUpArrowIcon.jpg">"
    file = file.replace('"','');

    //export const SourceSecurityRank:   ICDNCheck[] = [ 'Nothing' ,     'SecureCDN' ,          'Local',            'Tenant' ,          'ExternalApproved' ,  'ExternalWarn',   'Verify',     'WWW' ,  'ExternalBlock' ];

    let rank = SourceSecurityRank.indexOf( fileLocaton );

    let result : ITagInfo = {
        tag: tag,
        file: file,
        fileOriginal: fileOriginal,
        type: type,
        status: '',
        regex: regex,
        styleTag: styleTag,
        rank: rank,
        icon: SourceSecurityRankIcons[rank],
        color: SourceSecurityRankColor[rank],
        background: SourceSecurityRankBackG[rank],
        label: '',
        eleStyle: '',
        location: fileLocaton,
        policyFlags: policyFlags,
    };

    return result;
}

function isLocationSecure( lcFile: string, prevLocation: ICDNCheck ) {
    if ( prevLocation !== 'TBD' ) { return prevLocation ; }
    let fileLocaton: ICDNCheck = 'TBD';

    approvedSites.map( site => {
        if (lcFile.indexOf( `${site.siteRelativeURL.toLowerCase()}/` ) === 0 ) { fileLocaton = 'SecureCDN';  } else
        if (lcFile.indexOf( `${window.origin}${site.siteRelativeURL.toLowerCase()}/` ) === 0 ) { fileLocaton = 'SecureCDN';  }
    });

    return fileLocaton;

}

function isLocationLocal( lcFile: string, prevLocation: ICDNCheck ) {
    if ( prevLocation !== 'TBD' ) { return prevLocation ; }
    let fileLocaton: ICDNCheck = 'TBD';

    if (lcFile.indexOf( `../../` ) === 0 ) { fileLocaton = 'Tenant' ; } else
    if (lcFile.indexOf( `./` ) === 0 ) { fileLocaton = 'Local' ; } else
    if (lcFile === '#' ) { fileLocaton = 'Local' ; } else
    if (lcFile === '' ) { fileLocaton = 'Local' ; } else
    if (lcFile.indexOf( "href=''" ) === 0 ) { fileLocaton = 'Local' ; } else
    if (lcFile.indexOf( "href =''" ) === 0 ) { fileLocaton = 'Local' ; } else
    if (lcFile.indexOf( "href= ''" ) === 0 ) { fileLocaton = 'Local' ; } else
    if (lcFile.indexOf( "href = ''" ) === 0 ) { fileLocaton = 'Local' ; } else
    if (lcFile ==="href='#'" ) { fileLocaton = 'Local' ; } else
    if (lcFile ==='href="#"' ) { fileLocaton = 'Local' ; } else
    if (lcFile.indexOf( `../` ) === 0 ) { fileLocaton = 'Local' ; }

    return fileLocaton;

}

function isLocationTenant( lcFile: string, prevLocation: ICDNCheck ) {
    if ( prevLocation !== 'TBD' ) { return prevLocation ; }
    let fileLocaton: ICDNCheck = 'TBD';

    if (lcFile.indexOf( `../../` ) === 0 ) { fileLocaton = 'Tenant' ; } else
    if (lcFile.indexOf( `/sites/` ) === 0 ) { fileLocaton = 'Tenant' ; } else
    if (lcFile.indexOf( `${window.origin}/sites/` ) === 0 ) { fileLocaton = 'Tenant' ; }

    return fileLocaton;

}

function isLocationExtApp( lcFile: string, prevLocation: ICDNCheck, SecureFileProfile: IFileTypeSecurity ) {
    if ( prevLocation !== 'TBD' ) { return prevLocation ; }
    let fileLocaton: ICDNCheck = 'TBD';

    SecureFileProfile.cdns.approved.map( site => {
        let idx = lcFile.indexOf( site.toLowerCase() );
        if ( idx === 0 ) { fileLocaton = 'ExternalApproved' ; } 
    });

    return fileLocaton;

}

function isLocationWarnBlock( lcFile: string, prevLocation: ICDNCheck, SecureFileProfile: IFileTypeSecurity, type: IApprovedFileType, policyFlags: IPolicyFlag, level: IPolicyFlagLevel ) {
    if ( prevLocation !== 'TBD' ) { return { fileLocaton: prevLocation, policyFlags: policyFlags } ; }
    let fileLocaton: ICDNCheck = 'TBD';

    SecureFileProfile.cdns[level].map( site => {
        let idx = lcFile.indexOf( site.toLowerCase() );
        if ( idx === 0 ) { 
            fileLocaton = level === 'warn' ? 'ExternalWarn' : level === 'block' ? 'ExternalBlock' : 'TBD';
            policyFlags = { cdn: site, level: level, type: type, key: `${level}: ${type}-${site}`, verify: [] }  ;
        }
    });

    return { fileLocaton: fileLocaton, policyFlags: policyFlags } ;

}


