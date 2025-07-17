export class XAPIStatementBuilder {
  actor: string;
  endpoint: string;
  auth: string;
  
  constructor({ actor}) {
    this.actor = actor;
  }
  private _generateVerb(input: any) {
    const hasValue = (() => {
      const val = input.value;

      if (!val) return false;

      if (typeof val === "string") {
        return val.trim().length > 0;
      }

      if (Array.isArray(val)) {
        return val.some(item => item && typeof item === "object" && item.value === "on");
      }

      if (typeof val === "object") {
        return Object.keys(val).length > 0;
      }

      return false;
    })();

    if (hasValue) {
      return {
        id: "http://adlnet.gov/expapi/verbs/answered",
        display: { "en-US": "answered" }
      };
    } else {
      return {
        id: "http://adlnet.gov/expapi/verbs/attempted",
        display: { "en-US": "attempted" }
      };
    }
  }

  private _generateObject(
    tag_type: string,
    input_type: string,
    formId: string,
    itemId: string,
    inputName: string,
    inputLabel: string,
    questionNumber: string,
    inputValue: Record<string, string>[],
    language: string = "en-US"
  ) {
    let definition: {
            name: Record<string, string>,
            description: Record<string, string>,
            type?: string,
            interactionType?: string,
            choices?: { id: string, description: Record<string, string> }[]
            correctResponsesPattern?: string[]
          }  = {
        name: { [language]: inputName },
        description: { [language]: inputLabel }
    };

    const definitionName = (() => {
      if (questionNumber) {
        return `${questionNumber} ${inputLabel}`;
      } else {
        return inputName;
      }
    })()

    console.log('>>>>>thisssss',language)
    switch (tag_type?.toUpperCase()) {
        case 'TANGY-SIGNATURE':
        case 'TANGY-GPS':
        case 'TANGY-AUDIO-RECORDING':
        case 'TANGY-LOCATION':
            definition.type = "http://adlnet.gov/expapi/activities/media";
            definition.interactionType = "other";
            definition.description = { [language]: inputLabel };;
            break;
        case 'TANGY-INPUT':
        case 'TANGY-PARTIAL-DATE':
        case 'TANGY-ETHIO-DATE':
        case 'TANGY-SELECT':
            definition.name = { [language]: definitionName };
            definition.type = "http://adlnet.gov/expapi/activities/cmi.interaction";
            definition.interactionType = "fill-in";
            definition.description = { [language]: inputLabel };
            if(input_type === 'number'){
                definition.interactionType = "numeric";
            }
            break;
        case 'TANGY-RADIO-BUTTONS':
        case 'TANGY-RADIO-BLOCKS':
        case 'TANGY-CHECKBOXES':
            const choice:{id: string, description: Record<string, string>}[] = inputValue.map((item) => {
              const obj = {id: "", description: { [language]: "" }};
              obj["id"] = item.name;
              obj["description"] = { [language]: item.name};
              return obj;

            });

            definition.name = { [language]: definitionName };     
            definition.description = { [language]: inputLabel };
            definition.type = "http://adlnet.gov/expapi/activities/cmi.interaction";
            definition.interactionType = "choice";
            definition.choices = choice;
            break;
        case 'TANGY-TOGGLE':
            definition.name = { [language]: definitionName };     
            definition.description = { [language]: inputLabel };
            definition.type = "http://adlnet.gov/expapi/activities/cmi.interaction";
            definition.interactionType = "true-false";
            definition.correctResponsesPattern = ["true"];
            break;
        default:
            console.warn(`Unknown tag type: ${tag_type}. Defaulting to generic activity.`);
            break;
    }

    return {
        id: `http://tangerinecentral.org//form/${formId}/item/${itemId}/input/${inputName}`,
        objectType: "Activity",
        definition
    };
  }

  private _generateResult(formSubmitted: boolean, activityDuration:string, inputValue:string, required: boolean) {
    let userResponse: string | null;

    if (inputValue === "on") {
      userResponse = "true";
    } else if (inputValue === "") {
      userResponse = required ? "false" : null;
    } else {
      userResponse = inputValue;
    }

    return {
        completion: formSubmitted,
        success: formSubmitted,
        duration: activityDuration,
        response: inputValue === "on" ? "true" : inputValue,
        extensions: {
            "http://tangerinecentral.org/xapi/extensions/input-value": inputValue
        }
    }
  }


  buildStatements(data:any) {
    const { formData, activityDuration, formSubmitted, lang} = data;
    const statements = [];
    const formId = formData.form?.id || 'unknown-form';

    for (const item of formData.items || []) {
      const itemId = item.id;
      for (const input of item.inputs || []) {
        if (!input.disabled || input.skipped) continue;
        const inputName = input.name;
        const inputLabel = input.label || inputName;
        const inputValue = this._getInputValue(input);
        if (inputValue == null || inputValue === "") continue;
        const statement = {
          actor: this.actor,
          verb: this._generateVerb(input),
          object: this._generateObject(input.tagName, input.type, formId, itemId, inputName, inputLabel, input.questionNumber, input.value, lang),
          result: this._generateResult(formSubmitted, activityDuration, inputValue, input.required),
          timestamp: new Date().toISOString()
        };

        statements.push(statement);
      }
    }
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
}
