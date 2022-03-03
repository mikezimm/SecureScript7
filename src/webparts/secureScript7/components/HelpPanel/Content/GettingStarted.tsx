import * as React from 'react';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

import { SPPermission } from '@microsoft/sp-page-context';

import styles from '../banner/SinglePage/InfoPane.module.scss';


//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

export function gettingStartedContent( repoLinks: IRepoLinks ) {

    let html1 = <div>
        {/* Set to light yellow */}
        <div style={{ background: '#FEF9E7', padding: '10px' }}> 
            <h2 style={{textDecoration: 'underline'}}>Script Editor Properties</h2>
            <ul>
                <li>Paste web url in the web url property - must be valid</li>
                <li>Select Library in dropdown</li>
                <li>Select File in dropdown</li>
                <li>
                    <div>Show Code Audience</div>
                    <p>Show Code Audience will determine what level permissions will see the Show-Code icon. <b>NOTE:</b>  Site Admins and Site Owners will ALWAYS see this button.</p>
                </li>
            </ul>
        </div>
 

    </div>;

    return { html1: html1 };

}
  

