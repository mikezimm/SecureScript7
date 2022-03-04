
import * as React from 'react';

import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

import { Icon, ITag } from 'office-ui-fabric-react';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

import { IApprovedCDNs, IFetchInfo, ITagInfo, approvedFileTypes, approvedExternalCDNs, approvedSites, ISecurityProfile, SourceSecurityRank, IApprovedFileType, ICDNCheck , warnExternalCDNs, blockExternalCDNs, SourceSecurityRankColor, SourceSecurityRankBackG, SourceSecurityRankIcons } from './ApprovedLibraries';

export async function fetchSnippetCherry( context: any, libraryPicker: string , libraryItemPicker: string ) {

    let fileURL = libraryPicker + "/" + libraryItemPicker;

    const webURLQuery = context.pageContext.web.absoluteUrl + `/_api/sp.web.getweburlfrompageurl(@v)?@v=%27${window.location.origin}${fileURL}%27`;

    // if (props.url)
    // const htmlFragment: string = (props.url) ?
    let webURL = await context.spHttpClient.get(webURLQuery, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => response.json())
    .then(data => data.value);
    const snippetURLQuery = webURL + `/_api/web/getFileByServerRelativeUrl('${fileURL}')/$value`;

    const htmlFragment = await context.spHttpClient.get(snippetURLQuery, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => response.text());
    // : "<div>No content loaded.</div>";
    const newHtml = `<div id='thisReallyUniqueId'>${htmlFragment}<div>`;
    const node = document.createRange().createContextualFragment(newHtml);

}

const iconStyles: any = { root: {
    fontSize: 'x-large',
    fontWeight: 600,
    paddingRight: '10px',
    paddingLeft: '10px',
}};


// let scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
// let scriptSrcRegex = /<script.+?src=[\"'](.+?)[\"'].*?>/gi;
// let linkHrefRegex = /<link.+?href=[\"'](.+?)[\"'].*?>/gi;
export const srcRegex = /src=[\"'](.+?)[\"'].*?/gi;

// let hrefRegex = /href=[\"'](.+?)[\"'].*?/gi;

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

export function baseFetchInfo( warning: string ) {
    let base: IFetchInfo = {
        snippet: '',
        selectedKey: 'raw',
        errorHTML: warning,
        js: [],
        css: [],
        img:[],
        links:[],
        html:[],
        preFetchTime: 0,
        postFetchTime: 0,
        postRegexTime: 0,
        fetchTime: 0,
        regexTime: 0,
        nothing:[],
        secure:[],
        tenant:[],
        extApp:[],
        warns:[],
        blocks:[],
        every:[],
    };

    return base;

}

export async function fetchSnippetMike( context: any, webUrl: string, libraryPicker: string , libraryItemPicker: string , SecureProfile: ISecurityProfile ) {

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

    let cleanHtmlFragment = htmlFragment.replace('\\\"','"');

    let scriptTags2 = cleanHtmlFragment.match(srcJSRegex2);
    let scriptTags3 = cleanHtmlFragment.match(srcJSRegex3);
    let scriptTags = scriptTags2 ? scriptTags2 : [];
    //This will add scriptTags3 into scriptTags if it's not null
    if ( scriptTags3 ) { scriptTags3.map( tag => { scriptTags.push( tag ) ; });}

    let scripts : ITagInfo[] = scriptTags === null ? [] : scriptTags.map( tag => { 
        let matchTag = tag.match(srcRegex);
        let createTag = matchTag === null ? '' : matchTag[0].replace('src="',"").replace('"',"");
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'js', createTag, SecureProfile  );
        return tagInfo;
    });

    let cssTags = cleanHtmlFragment.match(hrefCSSRegex2);
    let css : ITagInfo[] = cssTags === null ? [] : cssTags.map( tag => { 
        let matchTag = tag.match(hrefCSSRegex);
        let createTag = matchTag === null ? '' : matchTag[0].replace('href="',"").replace('"',"");
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'css', createTag, SecureProfile  );
        return tagInfo;
    });

    let imgTags = cleanHtmlFragment.match(imgSrcRegex);
    let img : ITagInfo[] = imgTags === null ? [] : imgTags.map( tag => { 
        let matchTag = tag.match(srcRegex);
        let createTag = matchTag === null ? '' : matchTag[0].replace('src="',"").replace('\"','"');
        let tagInfo: ITagInfo = createBaseTagInfoItem( tag, 'img', createTag , SecureProfile );
        return tagInfo;
    });

    let postRegexTime = new Date();
    let result :  IFetchInfo= {
        selectedKey: 'raw',
        snippet: htmlFragment,
        errorHTML: '',
        js: scripts,
        css: css,
        img:img,
        links:[],
        html:[],
        preFetchTime: preFetchTime.getTime(),
        postFetchTime: postFetchTime.getTime(),
        postRegexTime: postRegexTime.getTime(),
        fetchTime: postFetchTime.getTime() - preFetchTime.getTime(),
        regexTime: postRegexTime.getTime() - postFetchTime.getTime(),
        nothing: [],
        secure: [],
        tenant: [],
        extApp: [],
        warns: [],
        blocks: [],
        every: [],
    };

    let allTags = [...scripts,...css,...img ];

    allTags.map( tag => {
        if ( tag.rank === 0 ) { result.nothing.push( tag ) ; } else
        if ( tag.rank === 1 ) { result.secure.push( tag ) ; } else
        if ( tag.rank === 2 ) { result.tenant.push( tag ) ; } else
        if ( tag.rank === 3 ) { result.extApp.push( tag ) ; } else
        if ( tag.rank === 4 ) { result.warns.push( tag ) ; } else
        if ( tag.rank === 5 ) { result.every.push( tag ) ; } else
        if ( tag.rank === 6 ) { result.blocks.push( tag ) ; }
    });

    //[ 'Nothing' ,     'SecureCDN' ,          'Tenant' ,          'ExternalApproved' ,  'ExternalWarn', 'Everything' ,  'ExternalBlock' ];
    if ( result.blocks.length > 0 ) { result.selectedKey = 'ExternalBlock' ; } else
    if ( result.warns.length > 0 ) { result.selectedKey = 'ExternalWarn' ; } else
    if ( result.every.length > 0 ) { result.selectedKey = 'Everything' ; } else
    if ( result.extApp.length > 0 ) { result.selectedKey = 'ExternalApproved' ; } else
    if ( result.secure.length > 0 ) { result.selectedKey = 'SecureCDN' ; } else
    if ( result.nothing.length > 0 ) { result.selectedKey = 'Nothing' ; }

    console.log( 'fetch results: ', result );
    return result;

}

export function createBaseTagInfoItem( tag: string, type: IApprovedFileType, file: string, SecureProfile: ISecurityProfile ) {
    let styleRegex = /style=[\"'](.+?)[\"'].*?/gi;
    let styleTagCheck = tag.match(styleRegex);
    let styleTag = styleTagCheck === null ? '' : styleTagCheck[0];
    let lcFile = file.toLowerCase();

    let fileLocaton : ICDNCheck = 'TBD';
    approvedSites.map( site => {
        if (lcFile.indexOf( `${site.siteRelativeURL.toLowerCase()}/` ) === 0 ) { fileLocaton = 'SecureCDN';  } else 
        if (lcFile.indexOf( `${window.origin}${site.siteRelativeURL.toLowerCase()}/` ) === 0 ) { fileLocaton = 'SecureCDN';  }   
    });

    if ( fileLocaton === 'TBD' ) {
        if (lcFile.indexOf( `/sites/` ) === 0 ) { fileLocaton = 'Tenant' ; } else
        if (lcFile.indexOf( `${window.origin}/sites/` ) === 0 ) { fileLocaton = 'Tenant' ; }
    }

    if ( fileLocaton === 'TBD' ) {
        approvedExternalCDNs.map( site => {
            let idx = lcFile.indexOf( site.toLowerCase() );
            if ( idx === 0 ) { fileLocaton = 'ExternalApproved' ; } 
        });
    }

    if ( fileLocaton === 'TBD' ) {
        warnExternalCDNs.map( site => {
            let idx = lcFile.indexOf( site.toLowerCase() );
            if ( idx === 0 ) { fileLocaton = 'ExternalWarn' ; } 
        });
    }

    if ( fileLocaton === 'TBD' ) {
        blockExternalCDNs.map( site => {
            let idx = lcFile.indexOf( site.toLowerCase() );
            if ( idx === 0 ) { fileLocaton = 'ExternalBlock';  } 
        });
    }

    if ( fileLocaton === 'TBD' ) { fileLocaton = 'Everything';  }

    //Found an example where image file had extra " at the end of the string.
    //"<img style="padding-left:20px;vertical-align:text-bottom" src="https://tenant.sharepoint.com/sites/CRS/Templates/icons/SharePointParentSiteUpArrowIcon.jpg">"
    file = file.replace('"','');

    let rank = SourceSecurityRank.indexOf( fileLocaton );

    let result : ITagInfo = {
        tag: tag,
        file: file,
        type: type,
        status: '',
        styleTag: styleTag,
        rank: rank,
        icon: SourceSecurityRankIcons[rank],
        color: SourceSecurityRankColor[rank],
        background: SourceSecurityRankBackG[rank],
        label: '',
        eleStyle: '',
        location: fileLocaton,
    };

    return result;
}