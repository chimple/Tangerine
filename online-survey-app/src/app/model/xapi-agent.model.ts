import { XapiActorBase } from './xapi-actor-base.model';

export class XapiAgent extends XapiActorBase {
  readonly objectType = 'Agent';

  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string }
  ) {
    super(name, mbox, mbox_sha1sum, openid, account);
  }

  static fromRaw(raw: any): XapiAgent {
    return new XapiAgent(raw.name, raw.mbox, raw.mbox_sha1sum, raw.openid, raw.account);
  }

  toJSON() {
    return {
      objectType: 'Agent',
      name: this.name,
      mbox: this.mbox,
      mbox_sha1sum: this.mbox_sha1sum,
      openid: this.openid,
      account: this.account
    };
  }
}