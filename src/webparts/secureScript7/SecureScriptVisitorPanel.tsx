import * as React from 'react';

import { ISecureScript7WebPartProps } from './ISecureScript7WebPartProps';
import { IPropertyFieldGroupOrPerson } from "@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

// import { LivePersona, Persona } from "@pnp/spfx-controls-react/lib/LivePersona";

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