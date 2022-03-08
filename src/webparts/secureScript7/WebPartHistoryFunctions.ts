/**
 * To use this feature:
 * Apply these changes
 * 
 * 


## Copy this to main WebpartProperties

    import { IWebpartHistory, IWebpartHistoryItem, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';

    //ADDED FOR WEBPART HISTORY:  
    webpartHistory: IWebpartHistory;



## Copy this to main WebpartProperties

    //Add this to MAIN WEBPART.ts
    import { IWebpartHistory, IWebpartHistoryItem, } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryInterface';
    import { createWebpartHistory, updateWebpartHistory } from '@mikezimm/npmfunctions/dist/Services/PropPane/WebPartHistoryFunctions';

    //ADDED FOR WEBPART HISTORY:  -
    //  === TO main webpart class
    private thisHistoryInstance: IWebpartHistoryItem = null;


    //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory - 
    // === TO END OF onInit function
    this.thisHistoryInstance = createWebpartHistory( 'onInit' , 'new', this.context.pageContext.user.displayName );
    let priorHistory : IWebpartHistoryItem[] = this.properties.webpartHistory ? this.properties.webpartHistory.history : [];
    this.properties.webpartHistory = {
        thisInstance: this.thisHistoryInstance,
        history: priorHistory,
    };


    //ADDED FOR WEBPART HISTORY:  This sets the webpartHistory
    //  === TO PropertyPaneChanged
    this.properties.webpartHistory = updateWebpartHistory( this.properties.webpartHistory , propertyPath , newValue, this.context.pageContext.user.displayName );


 */

    import { IWebpartHistoryItem, IWebpartHistory } from './WebPartHistoryInterface';

  export function createWebpartHistory( prop: any, newValue: any, user: string ) {

    let now = new Date();
    let timeString = now.toUTCString();

    let history : IWebpartHistoryItem = {
        time: timeString,
        user: user,
        fields: prop === 'onInit' ? [] : [ prop ],
        newValues: prop === 'onInit' ? [] : [ newValue ],
    };

    return history;

  }

  export function updateCurrentHistorySaved ( allHistory: IWebpartHistory, thisInstance: IWebpartHistoryItem ) {
    let maxHistoryLength = 20;
    let history: IWebpartHistoryItem[] = allHistory.history;

    if ( !history || history.length === 0 ) {
        history = [ thisInstance ];

    } else {
        if ( history [0].time !== thisInstance.time || history[0].user !== thisInstance.user ) {
            history.unshift( thisInstance );
        } else {
            history [0] = thisInstance;
        }

    }
    //Trim history to only last 20 saves
    if ( history.length > maxHistoryLength ) {
        history.length = maxHistoryLength;
    }
    
    allHistory.history = history;
    return allHistory;

  }


  export function updateWebpartHistory( webpartHistory: IWebpartHistory, prop: any, newValue: any, user: string, trimLength: number = 20 ) {

    let thisInstance = webpartHistory.thisInstance;

    if ( !thisInstance ) { thisInstance = createWebpartHistory( prop, newValue, user ) ; }

    let fieldIdx = thisInstance.fields.indexOf( prop );

    let strValue = typeof newValue === 'string' ? newValue : newValue.toString();
    let origLength = strValue.length;
    strValue= strValue.substring(0, trimLength );
    if ( origLength > strValue.length ) { strValue += ` ...[+${origLength - strValue.length}]` ; }
    if ( fieldIdx < 0 ) {
        thisInstance.fields.push( prop );
        thisInstance.newValues.push( strValue );
    } else {
        thisInstance.newValues[fieldIdx] = strValue ;
    }

    webpartHistory = updateCurrentHistorySaved( webpartHistory, thisInstance );

    console.log('webpartHistory: function', webpartHistory );

    return webpartHistory;

  }