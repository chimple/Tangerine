import { XapiActorBase } from "./xapi-actor-base.model";
import { XapiAgent } from "./xapi-agent.model";

export class XapiGroup extends XapiActorBase {
  objectType: 'Group' = 'Group';

  constructor(
    public name?: string,
    public mbox?: string,
    public mbox_sha1sum?: string,
    public openid?: string,
    public account?: { homePage: string; name: string },
    public member?: XapiAgent[]
  ) {
    super(name, mbox, mbox_sha1sum, openid, account);
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
    const member = (raw.member || []).map((m: any) =>
      XapiAgent.fromRaw(m)
    );

    return new XapiGroup(
      raw.name,
      raw.mbox,
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
  toJSON() {
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
