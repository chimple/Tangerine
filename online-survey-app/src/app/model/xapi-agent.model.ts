export interface IActorBase {
  name?: string;
  mbox?: string;
  mbox_sha1sum?: string;
  openid?: string;
  account?: {
    homePage: string;
    name: string;
  };
}
export interface IAgent extends IActorBase {
  objectType: 'Agent';
}

export class XapiAgent implements IAgent {
  objectType: 'Agent' = 'Agent';

  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string }
  ) {}

  static fromRaw(raw: any): XapiAgent {
    const name = Array.isArray(raw.name) ? raw.name[0] : raw.name;
    const mbox = Array.isArray(raw.mbox) ? raw.mbox[0] : raw.mbox;

    return new XapiAgent(name, mbox, raw.mbox_sha1sum, raw.openid, raw.account);
  }

  toJSON(): IAgent {
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