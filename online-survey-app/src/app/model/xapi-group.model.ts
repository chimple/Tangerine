import { XapiAgent, IActorBase, IAgent } from './xapi-agent.model'; // adjust path if needed


export interface IGroup extends IActorBase {
  objectType: 'Group';
  member?: IAgent[];
}

export class XapiGroup implements IGroup {
  objectType: 'Group' = 'Group';

  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string },
    public member?: XapiAgent[]
  ) {
    const identifiers = [mbox, mbox_sha1sum, openid, account].filter(Boolean);
    if (identifiers.length > 1) {
      throw new Error('A Group can have only one identifier (or none for anonymous group).');
    }
  }

    /**
     * Creates an XapiGroup instance from a raw object.
     * @param raw The raw object to convert.
     * @returns An instance of XapiGroup.
     */
  static fromRaw(raw: any): XapiGroup {
    const name = Array.isArray(raw.name) ? raw.name[0] : raw.name;
    const mbox = Array.isArray(raw.mbox) ? raw.mbox[0] : raw.mbox;

    const member = (raw.member || []).map((m: any) =>
      XapiAgent.fromRaw(m)
    );

    return new XapiGroup(
      name,
      mbox,
      raw.mbox_sha1sum,
      raw.openid,
      raw.account,
      member
    );
  }

    /**
     * Converts the XapiGroup instance to a JSON object.
     * @returns A JSON representation of the XapiGroup.
     */
  toJSON(): IGroup {
    return {
      objectType: 'Group',
      name: this.name,
      mbox: this.mbox,
      mbox_sha1sum: this.mbox_sha1sum,
      openid: this.openid,
      account: this.account,
      member: this.member?.map((m) => m.toJSON())
    };
  }
}
