import * as React from 'react';

import styles from '../banner/SinglePage/InfoPane.module.scss';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export function advancedContent( repoLinks: IRepoLinks ) {

    let thisTable = <div style={{ paddingTop: 15 }}>

        <h2>General comments about FPS style settings</h2>
        <p>Settings in <b>FPS options</b> are applied after the webpart first loads.  This means on slower connections, you may temporarily see original styling including elements you are trying to hide.  If this poses an issue, be sure to have minimal SharePoint content on the page.</p>
        <ul>
            <li>Do not have any other webparts or content on the page.</li>
            <li>Do not have any site navigation links.</li>
            <li>Disable the quick launch through site settings.</li>
            <li>Do not have a Site Icon (unless it is restricted to site owners or above).</li>
            <li>Minimize Banner/Header including with Powershell if neccessary</li>
        </ul>

        <p>Also note that these are using undocumented SharePoint properties which are subject to change without notice.  If this happens, please contact your SharePoint team.</p>

        <h2>PFS options - Expandoramic</h2>

        <h3>Enable Expandoramic Mode</h3>
        <p>Show the Expand Webpart Icon (Expandoramic Mode)</p>

        <h3>Page load default</h3>
        <p>This will determine if the webpart is pre-loaded as Expanded.  Default = Normal</p>

        <h3>Expandoramic Audience</h3>
        <p>This will determine what level permissions will see the Expand webpart icon.  <b>NOTE:</b>  Site Admins and Site Owners will ALWAYS see this button.</p>
    </div>;

    return { html1: thisTable };
    
    let messageRows = [];
 
    // messageRows.push( <tr><td></td><td></td><td></td></tr> );
    messageRows.push( <tr></tr> );

    let thisPage = <div>
        <h2></h2>
        <table className={styles.infoTable} style={{ width: '100%' }}>
            <tr><th>Info</th><th>Example</th><th>Details</th></tr>
            { messageRows }
        </table>
    </div>;


    return { html1: thisPage };

}
  

