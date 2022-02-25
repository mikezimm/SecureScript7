import * as React from 'react';

import styles from '../banner/SinglePage/InfoPane.module.scss';

import { Icon } from 'office-ui-fabric-react';

import * as links from '@mikezimm/npmfunctions/dist/Links/LinksRepos';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

export function whyContent( repoLinks: IRepoLinks ) {

    let table : IHelpTable  = {
        heading: 'Why use Pivot Tiles',
        headers: ['Web part','Features benefits, comparison'],
        rows: [],
    };

    // let iconSize = 'large';

    // let iconStyles: any = { root: {
    //     fontSize: 'x-large',
    //     fontWeight: 600,
    //     paddingRight: '10px',
    //     paddingLeft: '10px',
    // }};

    // let gridIcon = <Icon iconName={"GridViewSmall"}  style={ iconStyles } />; 

    let thisBenefits = <div>
        <ul>
            <li><b>Tile Categories:</b>  You type in categories, Webpart will find what tiles go in the categories based on the Title and Description.</li>
            <li><b>Auto-Tiles</b> <span> for Site Pages, News, Subsites, Lists, Libraries and Associated sites to hub.  Just toggle what you want to see.  No work, no maintanance!</span></li>
            <li>All Auto-links <b>use out of the box information</b> to build the tiles.</li>
            <li><b>Image, Title, Description, Link</b> are all auto-generated for you</li>
            <li>Just pick what you you want tiles for and there is <b>little to maintain</b></li>
            <li><b>Multiple layouts</b> including ability to end user to quickly change</li>
            <li><b>Adds additional context</b> to tiles automatically like:  Unique permissions, Checked Out status and more</li>
            <li>Easy way to access <b>site groups and permissions</b></li>
            <li>Highligts <b>Lists<b> and </b>Libraries<b> with </b>unique permissions</b></li>
            <li>In addition to the Auto Tiles, you can also <b>point to a list or even a documents/image library</b>.</li>
        </ul>
    </div>;

    table.rows.push( createWhyRow(<b>Pivot Tiles</b>, <span style={{ color: 'darkgreen', fontSize: 'larger' }}><b>{ `Benefits` } </b></span>, repoLinks ) );
    table.rows.push( createWhyRow(``, thisBenefits, repoLinks ) );

    table.rows.push( createWhyRow(<b>MSFT Hero</b>, <span><b>Big pictures</b>, Great when you have <b> &le; 5 links</b> and you only want them <b>on a single page</b>.</span>, repoLinks ) );
    table.rows.push( createWhyRow(<b>MSFT Quick Links</b>, <span><b>Tile icons</b> when you only have <b>a few on a single page</b>.</span>, repoLinks ) );
    table.rows.push( createWhyRow(<b>MSFT Call to Action</b>, <span><b>Image with Button</b> links.  Great for when you only have <b>one link on a single page</b>.</span>, repoLinks ) );
    
    table.rows.push( createWhyRow(``, ``, repoLinks ) );

    let ootbLimitations = <div>
        <ul>
            <li>All Microsoft web parts need to be <b>set up manually every place</b> you want them.</li>
            <li>You <b>can not easily re-use</b> the same setup on multiple pages.</li>
            <li><b>Every link in every instance</b> of the webpart needs to be <b>maintaned separately</b>.</li>
        </ul>
    </div>;

    table.rows.push( createWhyRow(<b>All MSFT Webparts</b>, <span  style={{ color: 'red', fontSize: 'larger' }}><b>Limitations</b></span>, repoLinks ) );
    table.rows.push( createWhyRow(``, ootbLimitations, repoLinks ) );

    table.rows.push( createWhyRow( ``, ``, repoLinks ) );

    return { table: table };

}
  
function createWhyRow( webpart: any, comments: any, repoLinks: IRepoLinks | null ) {

    let fullFocus = convertIssuesMarkdownStringToSpan( comments, repoLinks );

    let tds = [<span style={{whiteSpace: 'nowrap'}} >{ webpart }</span>,
        <span>{ fullFocus }</span>,] ;

    return tds;
}
