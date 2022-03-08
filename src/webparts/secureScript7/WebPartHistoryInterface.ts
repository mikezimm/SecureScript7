
export interface IWebpartHistoryItem {
    time: string;
    user: string;
    fields: string[];
    newValues: string[];

  }

  export interface IWebpartHistory {
    thisInstance: IWebpartHistoryItem;
    history: IWebpartHistoryItem[];
  }
