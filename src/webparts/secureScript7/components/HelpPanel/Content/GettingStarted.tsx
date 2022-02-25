import * as React from 'react';

import { IRepoLinks } from '@mikezimm/npmfunctions/dist/Links/CreateLinks';

import { convertIssuesMarkdownStringToSpan } from '@mikezimm/npmfunctions/dist/Elements/Markdown';

import styles from '../banner/SinglePage/InfoPane.module.scss';

//import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../Component/ISinglePageProps';
import { IHelpTableRow, IHelpTable, IPageContent, ISinglePageProps } from '../banner/SinglePage/ISinglePageProps';

export function gettingStartedContent( repoLinks: IRepoLinks ) {

    let html1 = <div>
        <h2>Box Tiles layout</h2>

        <h3>Images</h3>
        <p>By default, the image comes from the first link in the category that has a valid image property.  If you want a specific image, you need to promote the link to the top of that category.</p>
        <p>A 'Valid' image property means that the image link has a value.  It does not neccessarily mean that the value (if it is user-modified) is correct, or everyone has permission to see the picture.</p>
        <h3>Promoted Links</h3>
        <ul>
          <li>By default, all items in a category are sorted by Title or if a custom column is used, then the values in that column.</li>
          <li>You can have multiple promoted links.  They will all float to the top.</li>
          <li>Promoting an item will do the following:
            <ul>
              <li>Move items to the top of the links list for the box.</li>
              <li>Force the box image to come from a promoted link if it's available.</li>
              <li>If using Promoted Links, then the image for the box will come from the first sorted item that has a valid image property.</li>
              <li>If a valid image link isn't found in a Promoted link, it will use the next valid image link in the cateogry.</li>
            </ul>
          </li>
        </ul>
        <h4>How to Promote a link:</h4>
        <mark><p>Promoting a link <strong>is specific to a Category...</strong> so plan out your Categories ahead of time to save work.</p></mark>
        Example: Promote an item in a <strong>Category called:  'Software'</strong>
            <ol>
              <li>Make sure the webpart is showing the category called Software with some items.</li>
              <li>Go to Webpart Properties &gt; page 2 &gt; Box Tile Settings &gt; Keyword property (first property in the section)</li>
              <li><strong>Create a keyword</strong> used to promote items in categories:  example '<strong>Info</strong>'</li>
              <li>Go to the item you want to promote in the Software category</li>
              <li>Add a phrase in either the title or description that matches the 'Category Keyword'</li>
              <li>In this example, you would  need to have the phrase '<strong>Software Info</strong>' in the Description for it to be promoted under the Software category.</li>
              <li>Using this method allows you a flexible way to utilize more natural language as a promoting method in items like SitePages where you may only want to use out of the box columns.</li>
              <li>If you want an item to be promoted in two Categories like <strong>Software</strong> and <strong>Hardware</strong>, you would have to include both phrases in the description.
                <ul>
                <li>Example Description:  'This page shows both <strong>Software Info</strong> and <strong>Hardware Info</strong>.'</li>
                </ul>
              </li>
            </ol>
            <h4>Notes on using Promoted Links</h4>
            <li><mark>Note that there must be a space</mark> between the <strong>Category</strong> and the <strong>Keyword</strong></li>
            <li>The Category and Keywords are NOT case sensitive.  'Software Info' and 'SofTWARE iNFO' would both be promoted.</li>
            <li>Add * to end of Keyword to reverse the order of the cateogry and keyword</li>
            <li>To promote items like '<strong>Keyword Category</strong>' or '<strong>Info Software</strong>', use '<strong>Info*</strong>' as your Keyword</li>

            <h3>Box Tiles Styles - common custom styles</h3>
            <h4>Box Tiles</h4>
            <li>&#123; "background"&#58;"#005496" &#125; - make background pale blue</li>
            <h4>Flex Boxes</h4>
            <li>&#123; "justify-content"&#58;"center" &#125; - center boxes (instead of left justify)</li>
        </div>;

    return { html1: html1 };

}
  

