import type { XapiAgent } from './xapi-agent.model';
import type { XapiGroup } from './xapi-group.model';

declare var require: any;
export abstract class XapiActorBase {
  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string }
  ) {}

  abstract readonly objectType: 'Agent' | 'Group';
  
  
  static fromRaw(raw: any): XapiGroup | XapiAgent {
  if (raw.objectType === 'Group') {
    const { XapiGroup } = require("./xapi-group.model");
    return XapiGroup.fromRaw(raw);
  } else {
    const { XapiAgent } = require("./xapi-agent.model");
    return XapiAgent.fromRaw(raw);
  }
}

  abstract toJSON(): any;
}