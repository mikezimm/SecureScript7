
import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

//encodeDecodeString(this.props.libraryPicker, 'decode')
import { encodeDecodeString, } from "@mikezimm/npmfunctions/dist/Services/Strings/urlServices";

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

export interface ITagInfo {
    tag: string;
    file: string;
    status: string;
    style: string;
}

export interface IFetchInfo {
        snippet: string;
        scripts: ITagInfo;
        css: ITagInfo;
        img:ITagInfo;
        preFetchTime: number;
        postFetchTime: number;
        postRegexTime: number;
        fetchTime: number;
        regexTime: number;
}

export async function fetchSnippetMike( context: any, webUrl: string, libraryPicker: string , libraryItemPicker: string ) {

    if ( !webUrl || webUrl.length < 1 ) {
        console.log('fetchSnippetMike Err 0:', webUrl, libraryPicker, libraryItemPicker );
        return '<mark>Web URL is not valid.</mark>';
    } else if ( !libraryPicker || libraryPicker.length < 1 ) {
        console.log('fetchSnippetMike Err 1:', webUrl, libraryPicker, libraryItemPicker );
        return '<mark>Select a valid library.</mark>';
    } else if ( !libraryItemPicker || libraryItemPicker.length < 1 ) {
        console.log('fetchSnippetMike Err 2:', webUrl, libraryPicker, libraryItemPicker );
        return '<mark>Select a valid Filename.</mark>';
    }
    
    if ( webUrl === '' ) { webUrl = '/sites/SecureCDN'; }

    let fileURL = libraryPicker + "/" + libraryItemPicker;

    const snippetURLQuery = webUrl + `/_api/web/getFileByServerRelativeUrl('${fileURL}')/$value`;

    console.log('fetchSnippetMike: webUrl', webUrl );
    console.log('fetchSnippetMike: fileURL', fileURL );

    let preFetchTime = new Date();

    const htmlFragment = await context.spHttpClient.get(snippetURLQuery, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => response.text());
    // : "<div>No content loaded.</div>";
    console.log('fetchSnippetMike: htmlFragment', htmlFragment );

    let postFetchTime = new Date();

    // let scriptRegex = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
    // let scriptSrcRegex = /<script.+?src=[\"'](.+?)[\"'].*?>/gi;
    // let linkHrefRegex = /<link.+?href=[\"'](.+?)[\"'].*?>/gi;
    let srcRegex = /src=[\"'](.+?)[\"'].*?/gi;
    let styleRegex = /style=[\"'](.+?)[\"'].*?/gi;
    // let hrefRegex = /href=[\"'](.+?)[\"'].*?/gi;

    // //This gets all js src tags that are .js
    // let srcJSRegex = /src=[\"'](.+?).js[\"'].*?/gi;

    //This looks for src=*.js in script tag
    //For this, get group and just add .js
    let srcJSRegex2 = /<script[\s\S]src=[\"'](.+?).js[\"'].*?<\/script>/gi;

    // //This gets all js src tags that are .js
    let hrefCSSRegex = /href=[\"'](.+?).css[\"'].*?/gi;

    //This looks for href=*.css file within link tag
    //For this, get group and just add .css
    let hrefCSSRegex2 = /<link[\s\S]*?href=[\"'](.+?).css[\"'].*?>/gi;

    //This gets all js src tags that are .js
    //For this, get match and then look for src tag to get the extension
    let imgSrcRegex = /<img[\s\S]*?src=[\"'](.+?)\.(jpg|jpeg|png|webp|avif|gif|svg)[\"'].*?>/gi;

    let cleanHtmlFragment = htmlFragment.replace('\\\"','"');

    let scriptTags = cleanHtmlFragment.match(srcJSRegex2);
    let scripts : ITagInfo = scriptTags.map( tag => { 
        let tagInfo = {
            tag: tag,
            file: tag.match(srcRegex)[0].replace('src="',"").replace('"',""),
            status: '',
            style: '',
        };
        return tagInfo;
    });

    let cssTags = cleanHtmlFragment.match(hrefCSSRegex2);
    let css : ITagInfo = cssTags.map( tag => { 
        let tagInfo = {
            tag: tag,
            file: tag.match(hrefCSSRegex)[0].replace('href="',"").replace('"',""),
            status: '',
            style: '',
        };
        return tagInfo;
    });

    let imgTags = cleanHtmlFragment.match(imgSrcRegex);
    let img : ITagInfo = imgTags.map( tag => { 
        let tagInfo = {
            tag: tag,
            file: tag.match(srcRegex)[0].replace('src="',"").replace('\"','"'),
            status: '',
            style: tag.match(styleRegex)[0],
        };
        return tagInfo;
    });

    let postRegexTime = new Date();



    // // }

    let result :  IFetchInfo= {
        snippet: htmlFragment,
        scripts: scripts,
        css: css,
        img:img,
        preFetchTime: preFetchTime.getTime(),
        postFetchTime: postFetchTime.getTime(),
        postRegexTime: postRegexTime.getTime(),
        fetchTime: postFetchTime.getTime() - preFetchTime.getTime(),
        regexTime: postRegexTime.getTime() - postFetchTime.getTime(),
    };

    console.log( 'fetch results: ', result );
    return htmlFragment;

}