import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export const panelVersionNumber = '2022-03-05 -  1.0.1.05'; //Added to show in panel

export function aboutTable( repoLinks: IRepoLinks, showRepoLinks: boolean ) {

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus'],
        rows: [],
    };

    table.rows.push( createAboutRow('2022-03-05',"1.0.1.05","Close #3, #22, #10 - add importProps functionality, #15 - whitelist, #19 - quick peek tags", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('"',"\"","#24 - Terms of Use", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-03',"1.0.1.04","Close #16, #17, Advanced Help Docs, styling", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-03-01',"1.0.1.03","Close #5, #6, #7, #11 (file picker)", showRepoLinks === true ? repoLinks : null ) );
    table.rows.push( createAboutRow('2022-02-25',"1.0.1.01","Initial test build:  Banner, ShowCode, does not execute js unless in iframe", showRepoLinks === true ? repoLinks : null ) );

    return { table: table };

}

export function createAboutRow( date: string, version: string, focus: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( focus, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ date }</span>, 
        <span style={{whiteSpace: 'nowrap'}} >{ version }</span>, 
        <span>{ fullFocus }</span>,] ;

    return tds;
}