import { DisplayMode, Version } from '@microsoft/sp-core-library';

//import { IPerformanceOp, ILoadPerformance, IHistoryPerformance } from '';

export interface IPerformanceOp {
    label: string;
    start:  Date;
    end?:  Date;
    startStr:  string;
    endStr?:  string;
    ms?: number;
    mode?: DisplayMode;
    details?: IPerformanceOp[]; //Could be used to trace individual file loads
}

//For logging load times - for analytics
export interface ILoadPerformance {
    spPageContextInfoClassic: boolean;
    spPageContextInfoModern: boolean;
    forceReloadScripts: boolean;

    onInit:  Date ;
    constructor:  Date ;

    fetch:  IPerformanceOp  ;
    analyze:  IPerformanceOp  ;
    jsEval:  IPerformanceOp  ;

    history: boolean; // set to true to save session performance (for people who can see it)
}

//For logging events while running the web part
export interface IHistoryPerformance {
    times: IPerformanceOp [];
}