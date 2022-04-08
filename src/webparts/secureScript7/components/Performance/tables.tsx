import * as React from 'react';

import { IPerformanceOp, ILoadPerformanceSS7, IHistoryPerformance } from './IPerformance';

import styles from './performance.module.scss';

export function createPerformanceRows( performance: ILoadPerformanceSS7 ) {

    const { fetch, jsEval, analyze } = performance;

    const loadRows = [
      <tr>
        <th>Process</th>
        <th>Mode</th>
        <th>Time</th>
        <th>ms</th>
      </tr>
    ];
    [ 'fetch', 'analyze', 'jsEval' ].map( part => {
      const thisPart : IPerformanceOp = performance[part];
      if ( thisPart ) {
        let time = thisPart.startStr;
        loadRows.push( <tr>
          <td>{ thisPart.label }</td>
          <td>{ thisPart.mode === 1 ? 'View' : 'Edit' }</td>
          <td>{ time }</td>
          <td>{ thisPart.ms }</td>
        </tr>);
      }
    });

     return loadRows;

}

const headingStyles : React.CSSProperties = {fontSize: 'larger', paddingTop: '25px', fontWeight: 'bold'};

export function createPerformanceTableVisitor( performance: ILoadPerformanceSS7 ) {

    const loadSummary = <div className={ styles.performance } style={{ paddingLeft: '15px', paddingTop: '30px'}}>
      <div style={ headingStyles }>Load Performance:</div>
      <div style={{paddingBottom: '8px'}}>forceReloadScripts: { JSON.stringify( performance.forceReloadScripts )}</div>
      <table>
         {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
         { createPerformanceRows( performance ) }
      </table>
    </div>;

    return loadSummary;

}

export function createPerformanceTableSmall( performance: ILoadPerformanceSS7 ) {

     const loadSummary = <div className={ styles.performance } style={{ paddingLeft: '15px'}}>
       <div style={{paddingBottom: '8px'}}>forceReloadScripts: { JSON.stringify( performance.forceReloadScripts )}</div>
       <table>
          {/* { buildPerformanceTableRows( fetchInfo.performance ) } */}
          { createPerformanceRows( performance ) }
       </table>
     </div>;

     return loadSummary;

}