import * as React from 'react';

import { ISecureScript7WebPartProps } from './ISecureScript7WebPartProps';
import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

// import { LivePersona, Persona } from "@pnp/spfx-controls-react/lib/LivePersona";

/***
 *    d888888b d8b   db d888888b d88888b d8888b. d88888b  .d8b.   .o88b. d88888b 
 *      `88'   888o  88 `~~88~~' 88'     88  `8D 88'     d8' `8b d8P  Y8 88'     
 *       88    88V8o 88    88    88ooooo 88oobY' 88ooo   88ooo88 8P      88ooooo 
 *       88    88 V8o88    88    88~~~~~ 88`8b   88~~~   88~~~88 8b      88~~~~~ 
 *      .88.   88  V888    88    88.     88 `88. 88      88   88 Y8b  d8 88.     
 *    Y888888P VP   V8P    YP    Y88888P 88   YD YP      YP   YP  `Y88P' Y88888P 
 *                                                                               
 *                                                                               
 */

/**
 *
    documentationLink: string;
    supportContacts: string;
    panelMessageDescription1: string; //
    panelMessageSupport: string;
    panelMessageDocumentation: string;
 */
export interface IMinWPVisitorPanelInfo {

    bannerTitle: string;

    panelMessageDescription1: string; //
    panelMessageSupport: string;
    panelMessageDocumentation: string;

    documentationLinkDesc: string;
    documentationLinkUrl: string;

    supportContacts: IPropertyFieldGroupOrPerson[];

}

/***
 *    db    db d888888b .d8888. d888888b d888888b  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b db           d888888b d8b   db d88888b  .d88b.  
 *    88    88   `88'   88'  YP   `88'   `~~88~~' .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'     88             `88'   888o  88 88'     .8P  Y8. 
 *    Y8    8P    88    `8bo.      88       88    88    88 88oobY'      88oodD' 88ooo88 88V8o 88 88ooooo 88              88    88V8o 88 88ooo   88    88 
 *    `8b  d8'    88      `Y8b.    88       88    88    88 88`8b        88~~~   88~~~88 88 V8o88 88~~~~~ 88              88    88 V8o88 88~~~   88    88 
 *     `8bd8'    .88.   db   8D   .88.      88    `8b  d8' 88 `88.      88      88   88 88  V888 88.     88booo.        .88.   88  V888 88      `8b  d8' 
 *       YP    Y888888P `8888Y' Y888888P    YP     `Y88P'  88   YD      88      YP   YP VP   V8P Y88888P Y88888P      Y888888P VP   V8P YP       `Y88P'  
 *                                                                                                                                                       
 *                                                                                                                                                       
 */

export function visitorPanelInfo( wpProps: IMinWPVisitorPanelInfo,  ) {
    const {
        bannerTitle,
        documentationLinkDesc,
        documentationLinkUrl,
        supportContacts,
        panelMessageDescription1,
        panelMessageSupport,
        panelMessageDocumentation,
      } = wpProps;

    //    text-decoration: underline;
    const headingStyles : React.CSSProperties = {fontSize: 'larger', paddingTop: '25px', fontWeight: 'bold'};
    const subHeadingStyles : React.CSSProperties = {fontSize: 'normal', paddingLeft: '20px' };
    const subHeadingStylesAround : React.CSSProperties = {fontSize: 'normal', padding: '16px 20px 0px 20px' };
    const contactStyles : React.CSSProperties = {fontSize: 'normal', padding: '16px 20px 0px 20px' };

    const Description1 = !panelMessageDescription1 ? null : 
        <div style={ subHeadingStyles }>{ panelMessageDescription1 }</div>;

    const Support = !panelMessageSupport ? null : 
        <div style={ subHeadingStylesAround }>{ panelMessageSupport }</div>;

    const DocumentationMessage = !panelMessageDocumentation ? null : 
        <div style={ subHeadingStylesAround }>{ panelMessageDocumentation }</div>;

    // const liveContacts = supportContacts.map( contact => {
    //     return <LivePersona upn={ contact.email }
    //     template={
    //       <>
    //         <Persona text={ contact.fullName } secondaryText={ contact.email } coinSize={48} />
    //       </>
    //     }
    //    serviceScope={context.serviceScope}
    //   />
    // })

    const cardStyles : React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '5px',

    };


    const contactList = !supportContacts ? [] : supportContacts.map( contact => {
        return <div style={ cardStyles }>
            <img src={contact.imageUrl} alt={`Picture of ${ contact.fullName}`} width={ 30 } height={ 30 } style={{borderRadius: '50%' }}  />
            <a style={{ paddingLeft: '20px', paddingRight: '20px' }} href={ `mailto:${contact.email}`}>Email</a>
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>{ contact.fullName }</div>
        </div>;
    });
    const ContactInfo = contactList.length === 0 ? null : <div style={ contactStyles }>
        { contactList }
    </div>;

    // const ContactInfo = supportContacts[0].fullName;

    let validLink = panelMessageDocumentation && panelMessageDocumentation.length > 0 && 
        (
            panelMessageDocumentation.indexOf('./') === 0 ||
            panelMessageDocumentation.indexOf('../') === 0 ||
            panelMessageDocumentation.indexOf('/sites') === 0 ||
            panelMessageDocumentation.indexOf(window.origin) === 0
        ) ? '' : 'Please Verify Link :(';

    const docsLink = !panelMessageDocumentation ? null : <div style={ contactStyles }>
        <span onClick={() => onLinkClick( documentationLinkUrl )} style={{ color: 'blue' , cursor: 'pointer', paddingRight: '30px' }} >{ documentationLinkDesc }</span><span>{validLink}</span>
    </div>;


/***
 *    d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *    88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *    88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *    88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *    88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *    88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                       
 *                                                       
 */


    return <div style={{ fontSize: 'larger'}}>
        <h2 >{`Support information for: ${ bannerTitle ? bannerTitle : 'This web part' }`}</h2>

        { Description1 }

        <div style={ headingStyles }>If the webpart displays a warning</div>
        <div style={ subHeadingStyles }> - please notify someone listed below</div>

        <div>{ ContactInfo }</div>  

        <div style={ headingStyles }>Please review our support documentation</div>
        <div style={ subHeadingStyles }> - before asking for additional support</div>
        { Support }
        { DocumentationMessage }
        { docsLink }
        <div style={ headingStyles }>If you still have issues...</div>
        <div style={ subHeadingStyles }> - please contact the owner of this webpart before submitting an incident.</div>
        <div>{ ContactInfo }</div>  
    </div>;
}

function onLinkClick( gotoLink: string ) {
    // alert('Going to ' + gotoLink );
    window.open( gotoLink, '_none' ) ;
}