
import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

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

export async function fetchSnippetMike( context: any, webUrl: string, libraryPicker: string , libraryItemPicker: string ) {

    if ( webUrl === '' ) { webUrl = '/sites/TestScriptandFiles'; }
    let fileURL = libraryPicker + "/" + libraryItemPicker;


    const snippetURLQuery = webUrl + `/_api/web/getFileByServerRelativeUrl('${fileURL}')/$value`;

    console.log('fetchSnippetMike: webUrl', webUrl );
    console.log('fetchSnippetMike: fileURL', fileURL );


    const htmlFragment = await context.spHttpClient.get(snippetURLQuery, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => response.text());
    // : "<div>No content loaded.</div>";
    console.log('fetchSnippetMike: htmlFragment', htmlFragment );

    return htmlFragment;

}