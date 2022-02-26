import * as React from 'react';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

import styles from '../banner/SinglePage/InfoPane.module.scss';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

export function gettingStartedContent( repoLinks: IRepoLinks ) {

    let html1 = <div>
        <h2>Setting scripts to run - Web part property pane</h2>
        <ul>
            <li>Select Web in dropdown (if it is unlocked)</li>
            <li>Select Library in dropdown</li>
            <li>Select File in dropdown</li>
            {/* <li></li> */}
        </ul>

        <h2>Script Editor Properties</h2>
        <h3>Show Code Audience</h3>
        <p>This will determine what level permissions will see the Show-Code icon. <b>NOTE:</b>  Site Admins and Site Owners will ALWAYS see this button.</p>
 
        </div>;

    return { html1: html1 };

}
  

