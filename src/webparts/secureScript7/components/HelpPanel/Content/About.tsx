import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export const panelVersionNumber = '2022-02-25 -  1.0.1.01'; //Added to show in panel

export function aboutTable( repoLinks: IRepoLinks ) {

    let underScoreIssue = <a href="https://github.com/mikezimm/Pivot-Tiles/issues/30" target="_blank">Issue #30</a>;

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus'],
        rows: [],
    };

    table.rows.push( createAboutRow('2022-03-01',"1.0.1.02","Close #6, #7 (file picker)", repoLinks ) );
    table.rows.push( createAboutRow('2022-02-25',"1.0.1.01","Initial test build:  Banner, ShowCode, does not execute js unless in iframe", repoLinks ) );

    return { table: table };

}

function createAboutRow( date: string, version: string, focus: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( focus, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ date }</span>, 
        <span style={{whiteSpace: 'nowrap'}} >{ version }</span>, 
        <span>{ fullFocus }</span>,] ;

    return tds;
}