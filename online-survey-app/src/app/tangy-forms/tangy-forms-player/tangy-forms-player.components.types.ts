export interface TangyFormResponse {
  _id: string;
  collection: string;
  form: Form;
  items: TangyFormItem[];
  complete: boolean;
  hasUnlocked: boolean;
  focusIndex: number;
  nextFocusIndex: number;
  previousFocusIndex: number;
  startDatetime: string;
  startUnixtime: number;
  uploadDatetime: string;
  location: Record<string, any>; // empty object, but could hold GPS etc.
  type: string;
  lastSaveUnixtime: number;
  previousItemId: string;
}

export interface Form {
  fullscreenNavAlign: string;
  fullscreenInline: boolean;
  openInFullscreen: boolean;
  fullscreen: boolean;
  title: string;
  complete: boolean;
  linearMode: boolean;
  hideClosedItems: boolean;
  hideCompleteFab: boolean;
  tabIndex: number;
  showResponse: boolean;
  showSummary: boolean;
  hasSummary: boolean;
  fullScreenGranted: boolean;
  exitClicks: number;
  cycleSequences: string;
  recordItemFirstOpenTimes: boolean;
  id: string;
  tagName: string;
  sequenceOrderMap: string;
}

export interface TangyFormItem {
  id: string;
  title: string;
  customScoringLogic: string;
  customScore?: number | null;
  summary: boolean;
  fullscreen: boolean;
  fullscreenNavAlign: string;
  fullscreenEnabled: boolean;
  hideButtons: boolean;
  hideBackButton: boolean;
  hideNavIcons: boolean;
  hideNavLabels: boolean;
  rightToLeft: boolean;
  hideNextButton: boolean;
  showCompleteButton: boolean;
  inputs: TangyInput[];
  open: boolean;
  incomplete: boolean;
  disabled: boolean;
  hidden: boolean;
  locked: boolean;
  isDirty: boolean;
  incorrectThreshold?: number | null;
  firstOpenTime: number;
  tagName: string;
}

export interface TangyInput {
  name: string;
  value: string;
  hintText: string;
  required: boolean;
  disabled: boolean;
  hasWarning: boolean;
  hasDiscrepancy: boolean;
  label: string;
  optionSelectLabel: string;
  secondaryLabel: string;
  hidden: boolean;
  skipped: boolean;
  invalid: boolean;
  incomplete: boolean;
  questionNumber: string;
  errorText: string;
  warnText: string;
  discrepancyText: string;
  identifier: boolean;
  tagName: string;
  xapiStatement: XapiStatement;
}

export interface XapiStatement {
  actor: {
      mbox?: string,
      name?: string,
      objectType?: 'Agent' | 'Group'
  },
  verb: {
    id: string;
    display: {
      "en-US": string;
    };
  };
  object: {
    id: string;
    objectType: string;
    definition: {
      name: {
        "en-US": string;
      };
      description: {
        "en-US": string;
      };
      type: string;
      interactionType: string;
      choices: XapiChoice[];
    };
  };
  result: {
    response: string;
  };
}

export interface XapiChoice {
  id: string;
  description: {
    "en-US": string;
  };
}