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