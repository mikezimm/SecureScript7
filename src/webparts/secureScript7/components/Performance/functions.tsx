import * as React from 'react';

import { IPerformanceOp, ILoadPerformance, IHistoryPerformance } from './IPerformance';

//import { startPerformInit, startPerformOp, } from '../Performance/functions';

// export function buildPerformanceTableRows( performance: ILoadPerformance ) {
//     const { fetch, jsEval, analyze } = performance;

//     const loadRows = [
//       <tr>
//         <th>Process</th>
//         <th>Mode</th>
//         <th>Time</th>
//         <th>ms</th>
//       </tr>
//     ];
//     [ 'fetch', 'analyze', 'jsEval' ].map( part => {
//       const thisPart : IPerformanceOp = performance[part];
//       if ( thisPart ) {
//         let time = thisPart.startStr;
//         loadRows.push( <tr>
//           <td>{ thisPart.label }</td>
//           <td>{ thisPart.mode === 1 ? 'View' : 'Edit' }</td>
//           <td>{ time }</td>
//           <td>{ thisPart.ms }</td>
//         </tr>);
//       }
//     });

//     return loadRows;
// }


export function startPerformInit( classic, modern, reload, editMode, history ){

    let result: ILoadPerformance = {
        spPageContextInfoClassic: classic,
        spPageContextInfoModern: modern,
        forceReloadScripts: reload,

        onInit:  new Date(),
        constructor:  null,

        fetch:  null, // startPerformOp('fetch', editMode ),
        analyze:  null, // startPerformOp('analyze', editMode ),
        jsEval:  null, // startPerformOp('eval', editMode ),

        history: history, // set to true to save session performance (for people who can see it)
    };

    return result;

}

export function startPerformOp ( label, editMode ) {
    let start = new Date();
    let result: IPerformanceOp = {
        label: label,
        start: start,
        startStr: start.toLocaleTimeString(),
        mode: editMode,
        details: [],//Could be used to trace individual file loads
    };

    return result;
}

export function updatePerformanceEnd( op: IPerformanceOp, updateMiliseconds:  boolean, ) {
    op.end = new Date();
    op.endStr = op.end.toLocaleTimeString();
    if ( updateMiliseconds === true ) op.ms = op.end.getTime() - op.start.getTime();
    return op;
}

export function updatePerformOpSimple ( ops: IPerformanceOp[] ) {
    
    if ( ops.length > 0 ) {
        let last = ops.length -1;
        ops[last] = updatePerformanceEnd( ops[last], true );
    }
    return ops;
}

export function startPerformOpDetail ( ops: IPerformanceOp[], label: string, editMode: boolean, update: boolean = true ) {
    let last = ops.length -1;

    if ( update === true && ops.length > 0 ) {
        ops[last] = updatePerformanceEnd( ops[last], update );
    }

    if ( label ) {
        ops[ last ].details.push( startPerformOp( label, editMode ) );
    }
    return ops;
}