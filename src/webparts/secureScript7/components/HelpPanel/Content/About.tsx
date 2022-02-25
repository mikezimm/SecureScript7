import * as React from 'react';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export const panelVersionNumber = '2021-12-13 -  1.5.1.2'; //Added to show in panel

export function aboutTable( repoLinks: IRepoLinks ) {

    let underScoreIssue = <a href="https://github.com/mikezimm/Pivot-Tiles/issues/30" target="_blank">Issue #30</a>;

    let table : IHelpTable  = {
        heading: 'Version History',
        headers: ['Date','Version','Focus'],
        rows: [],
    };


    table.rows.push( createAboutRow('2022-02-18', '1.5.2.5', `Add expandoPadding`, repoLinks ) );
    table.rows.push( createAboutRow('2022-02-18', '1.5.2.4', `#168 - Add Expandoramic Mode.`, repoLinks ) );

    table.rows.push( createAboutRow('2022-02-17', '1.5.2.3', `#159 - Add Import Settings.  #165 - Revamp Property Pane groups.`, repoLinks ) );
    table.rows.push( createAboutRow('"', '"'               , `#161 - Add Error message to banner.  Update Export format to be grouped.`, repoLinks ) );

    table.rows.push( createAboutRow('"'          ,'"'      , `#143, #163 - hide command bar, #162 - collapse header, `, repoLinks ) );

    table.rows.push( createAboutRow('2022-02-04', '1.5.2.1', `#156 - Add Manual Links, #155 - Panel Tip, #158 - Export Settings`, repoLinks ) );
    
    table.rows.push( createAboutRow('2022-02-01', '1.5.2.0', `#148 - Add tile size options, #147 - About NewsLink Easy Edits`, repoLinks ) );
    table.rows.push( createAboutRow('"'          ,'"'        , `#153 - Add Why this webpart to Help Panel, #107 - Mygroups Tab names`, repoLinks ) );
    table.rows.push( createAboutRow('2021-12-13', '1.5.1.2', `#139 - Fix default custom column prop`, repoLinks ) );
    table.rows.push( createAboutRow('2021-12-09', '1.5.1.1', `Responsive Banner updates`, repoLinks ) );
    table.rows.push( createAboutRow('2021-12-07', '1.5.1.0', `User Settings & Search Overflow: hidden`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-29', '1.5.0.8', `Add Home Page, Parent Site navigation, Site Info, Fix issues`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-29', '1.5.0.7', `Settings and Parent Sites banner.  Close issues:  #47`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-12', '1.5.0.6', `BoxTiles toggle, Close issues:  #56, #114, #118, #121, #127`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-10', '1.5.0.5', `Add BoxTiles Getting started instructions`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-09', '1.5.0.4', `Fix Modules folder bug`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-05', '1.5.0.3', `Promote best image to BoxTile layout`, repoLinks ) );
    table.rows.push( createAboutRow('2021-11-04', '1.5.0.2', `Layout and BoxTiles improvements`, repoLinks ) );
    table.rows.push( createAboutRow('2021-10-29', '1.5.0.1', `Add Auto-Other-Groups, Box Tiles, Upgraded Help Panel`, repoLinks ) );

    table.rows.push( createAboutRow('2021-08-09', '1.4.3.3', `Improve Permissions History to work with Easy Contents`, repoLinks ) );
    table.rows.push( createAboutRow('2021-07-30', '1.4.2.0', `Hide System Pages and Libraries, Save Permissions History`, repoLinks ) );

    table.rows.push( createAboutRow('2021-05-14', '1.4.1.4', `Standardize HelpInfo and EarlyAccess components`, repoLinks ) );
    table.rows.push( createAboutRow('2021-05-14', '1.4.1.3', `Add Shared Details functionality under Permissions tab, history also includes filenames and links`, repoLinks ) );
    table.rows.push( createAboutRow('2021-05-11', '1.4.1.2', `Narrow width Permissions, Remove double permissions fetch, Fix select FileSystemObjectType, error`, repoLinks ) );
    table.rows.push( createAboutRow('2021-05-04', '1.4.1.1', `Fix select PromotedState,FirstPublishedDate, on tile lists`, repoLinks ) );
    table.rows.push( createAboutRow('2021-05-03', '1.4.1.0', `Add Auto NEWS, with special capabilities`, repoLinks ) );
    table.rows.push( createAboutRow('', '', `Add Auto PAGES, with special capabilities`, repoLinks ) );
    table.rows.push( createAboutRow('', '', `Add Warning and Info Icons on lot of tiles`, repoLinks ) );
    table.rows.push( createAboutRow('', '', `Add more custom styling options`, repoLinks ) );

    table.rows.push( createAboutRow('2021-04-22', '1.4.0.6', `Add FPS Options and FPS Logo`, repoLinks ) );
    table.rows.push( createAboutRow('2021-04-19', '1.4.0.5', `Add delta permissions on library, add panel click to Limited Access permissions`, repoLinks ) );
    table.rows.push( createAboutRow('2021-04-16', '1.4.0.4', `Add group audience targeting, fpsPageStyles`, repoLinks ) );
    table.rows.push( createAboutRow('2021-04-12', '1.4.0.3', `Add Permissions Panel, shortcut links, Advanced help`, repoLinks ) );
    table.rows.push( createAboutRow('2021-04-12', '1.4.0.2', `Some categories can be just icon (like groups, permissions etc), fix permissions 'complex' bug`, repoLinks ) );
    table.rows.push( createAboutRow('2021-04-11', '1.4.0.1', `Add Web and List Permissions`, repoLinks ) );

    table.rows.push( createAboutRow('2021-02-29', '1.3.0.1', `Load Hub site icons first time, massive npmFunctions overhaul`, repoLinks ) );

    table.rows.push( createAboutRow('2020-12-17', '1.2.2.10', `Fix SiteAdmins for Visitors, sync zFunctions`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-11', '1.2.2.9', `Add Site Admins tab in Groups`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-10', '1.2.2.6', `Fix Subsites for visitors crash`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-04', '1.2.2.5', `Fix fetch users in groups with OnlyAllowMembersViewMembership === true crash, pushMissingDefaultsThatCauseIssues`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-04', '1.2.2.4', `Add quick-sort button, remove support for 'modified' type quick custom categories`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-03', '1.2.2.3', `Auto add Associated Groups to settings when opening property pane, complex group styles and options`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-02', '1.2.2.2', `Small bug fixes with groups, categories, properties`, repoLinks ) );
    table.rows.push( createAboutRow('2020-12-01', '1.2.2.1', `Add CTRL-Click Group Name to add members, improve GroupInfo, Allow 'Hub' as hubCategory`, repoLinks ) );


    table.rows.push( createAboutRow('2020-11-24', '1.2.2.0', `Add Hubsites and Groups tabs`, repoLinks ) );
    table.rows.push( createAboutRow('2020-11-19', '1.2.1.0', `Add filtering based on the Title/Description properties`, repoLinks ) );
    table.rows.push( createAboutRow('2020-11-19', '1.2.0.0', `Complete Rebuild of solution to PivotTiles7`, repoLinks ) );
    table.rows.push( createAboutRow('2020-11-17', '1.1.3.1', `Use Fabric ${devLinks.devDocsIcon} as Tiles`, repoLinks ) );


    table.rows.push( createAboutRow('2020-11-16',"1.1.3.0",`Add option to show Subsites as tiles ${ underScoreIssue }`, repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-23',"1.1.2.0",`Custom Categories with _UnderScore , List and Doc Card view updates ${ underScoreIssue }`, repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-20',"1.1.1.4","Add special custom Categories:  created, modified", repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-20',"1.1.1.3","For Dynamic Categories, Tabs now in same order as you type in.  Pad Title, Desc in hover pane.", repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-19',"1.1.1.2","Add Basics Info, Dynamic Categoris (CTRL-Click Search box)", repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-19',"1.1.1.1","Fix Custom Category when missing catergory column", repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-14',"1.1.1.0","Add Early Access, Custom Category Logic", repoLinks ) ) ;
    table.rows.push( createAboutRow('2020-10-14',"1.1.0.2","Add Site News BannerImageUrl.Url for Image", repoLinks ) );
    
    return { table: table };

}

function createAboutRow( date: string, version: string, focus: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( focus, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ date }</span>, 
        <span style={{whiteSpace: 'nowrap'}} >{ version }</span>, 
        <span>{ fullFocus }</span>,] ;

    return tds;
}