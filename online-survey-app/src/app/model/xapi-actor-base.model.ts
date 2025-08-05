import { XapiAgent } from "./xapi-agent.model";
import { XapiGroup } from "./xapi-group.model";

export abstract class XapiActorBase {
  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string }
  ) {}

  abstract readonly objectType: 'Agent' | 'Group';
  
  static fromRaw(raw: any): XapiAgent | XapiGroup {
    return raw.objectType === 'Group'
      ? XapiGroup.fromRaw(raw)
      : XapiAgent.fromRaw(raw);
  }

  abstract toJSON(): any;
}