import * as React from 'react';

import styles from '../banner/SinglePage/InfoPane.module.scss';

import * as devLinks from '@mikezimm/npmfunctions/dist/Links/LinksDevDocs';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

export function advancedContent( repoLinks: IRepoLinks ) {

    let messageRows = [];
 
    // messageRows.push( <tr><td></td><td></td><td></td></tr> );
    messageRows.push( <tr><td>Open Site Admin Permissions</td><td>CTRL-Click <strong>Admins</strong> tab</td><td>Only available to Site Admins when in <strong>Groups</strong> or <strong>Permissions</strong> tabs.</td></tr> );
    messageRows.push( <tr><td>Open Current Web Permissions</td><td>CTRL-Click <strong>web</strong> tab</td><td>Available when in <strong>Permissions</strong> tabs.</td></tr> );
    messageRows.push( <tr><td>Open List-Library Permissions</td><td>CTRL-Click <strong>List</strong> tab</td><td>Available when in <strong>Permissions</strong> tabs.</td></tr> );
    messageRows.push( <tr><td>Open Group Settings</td><td>ALT-Click <strong>Group</strong> tab</td><td>Opens settings for Group, Only available to Site Admins when in <strong>Groups</strong> or <strong>Permissions</strong> tabs.</td></tr> );
    messageRows.push( <tr><td>Icon only tabs</td><td><mark>icon=Car</mark></td><td>Applies to certain categories like <mark>Hub, Permissions, Groups, Subsites</mark>.  <br></br>With this syntax, you can remove the text label and only show an icon.  <br></br>Note that Groups and Permissions tabs will always use a standard icon so this just removes the text label to add more space</td></tr> );

    messageRows.push( <tr><td>CTRL-Click on <b>Search Box</b></td><td><mark>Word1;Word2;Word3</mark></td><td>Type <b>; separated Keywords</b> and <b>ENTER</b> rebuild Tile Categories</td></tr> );
    messageRows.push( <tr><td>Search Box SHOULD turn <mark>Yellow</mark></td><td><mark>reset</mark></td><td>Type <b>'reset'</b> and <b>Enter</b> to reset Tile Categories</td></tr> );


    let customCatWiki = <a href="https://github.com/mikezimm/pivottiles7/wiki/Custom-Category---basic" target="_blank">Github Wiki</a>;

    messageRows.push( <tr><td>Custom Categories</td><td></td><td>See { customCatWiki } for examples</td></tr> );


    messageRows.push( <tr><td>Fabric UI {devLinks.devDocsIcon}</td><td></td><td>Set your ImageUrl column value to a valid Fabric UI Icon name - {devLinks.devDocsIcon}</td></tr> );
    messageRows.push( <tr><td>Valid Icon Examples</td><td></td><td>Cat Auto Edit etc.... must be exact leter casing.</td></tr> );
    messageRows.push( <tr><td>Colored Icons</td><td></td><td>Set Icon colors in your designated Color column.  Example:  font=green;background=yellow</td></tr> );

    messageRows.push( <tr><td>Adjust Size and Top of Icon</td><td></td><td>Set Icon size(% tile height)/top in your designated Color column.  Example:  size=50;top=-20px</td></tr> );           
    messageRows.push( <tr><td></td><td></td><td>If you can't see correct styles, be sure all values are separated by ; and have =</td></tr> );   
    messageRows.push( <tr><td>Full example of Icon styles</td><td></td><td>background=black;font=hotpink;size=50;top=-20px</td></tr> );   

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
  

