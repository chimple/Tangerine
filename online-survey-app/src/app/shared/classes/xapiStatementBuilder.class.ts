export class XAPIStatementBuilder {
  actor: string;
  endpoint: string;
  auth: string;
  
  constructor({ actor, endpoint, auth }) {
    this.actor = actor; // { name, mbox }
    this.endpoint = endpoint;
    this.auth = auth; // Base64 encoded "user:password"
  }

  buildStatements(formData) {
    const statements = [];

    console.log("Building xAPI statements for form data:", formData);

    const formId = formData.form?.id || 'unknown-form';

    for (const item of formData.items || []) {
      const itemId = item.id;
      for (const input of item.inputs || []) {
        console.log("Processing input:", input);
        if (!input.disabled || input.skipped) continue;
        const inputName = input.name;
        const inputLabel = input.label || inputName;
        const inputValue = this._getInputValue(input);

        if (inputValue == null || inputValue === "") continue;

        const statement = {
          actor: this.actor,
          verb: {
            id: "http://adlnet.gov/expapi/verbs/answered",
            display: { "en-US": "answered" }
          },
          object: {
            id: `http://yourapp.com/form/${formId}/item/${itemId}/input/${inputName}`,
            definition: {
              name: { "en-US": inputLabel },
              description: { "en-US": `User answered: ${inputLabel}` },
              type: "http://adlnet.gov/expapi/activities/question"
            }
          },
          result: {
            response: inputValue
          },
          timestamp: new Date().toISOString()
        };

        statements.push(statement);
      }
    }
    console.log("Generated xAPI statements:", statements); 
    return statements;
  }

  _getInputValue(input) {
    if (Array.isArray(input.value)) {
      const selected = input.value
        .filter(v => v.value === "on" || v.value === true)
        .map(v => v.name || v.value)
        .join(", ");
      return selected || null;
    }

    if (typeof input.value === "string" || typeof input.value === "number") {
      return input.value;
    }

    return null;
  }

  async sendStatement(statement) {
    const response = await fetch(`${this.endpoint}/statements`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${this.auth}`,
        "Content-Type": "application/json",
        "X-Experience-API-Version": "1.0.3"
      },
      body: JSON.stringify(statement)
    });

    if (!response.ok) {
      console.error("Failed to send xAPI statement", await response.text());
    } else {
      console.log("xAPI statement sent successfully");
    }

    return response;
  }

  async sendStatements(statements) {
    for (const stmt of statements) {
      await this.sendStatement(stmt);
    }
  }
}
