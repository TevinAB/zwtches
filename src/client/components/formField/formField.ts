import { ValidatorOptions } from '@/types';

export default function formField(
  fieldId: string,
  fieldType: string,
  pattern: string,
  labelText: string,
  validators: ValidatorOptions
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('form-field__container');

  container.appendChild(createLabel(fieldId, labelText));
  container.appendChild(
    createInputField(fieldId, fieldType, pattern, validators)
  );
  container.appendChild(createErrorMsg());
  return container;
}

function createLabel(fieldId: string, labelText: string) {
  const label = document.createElement('label');
  label.classList.add('form-field__label');
  label.innerText = labelText;
  label.setAttribute('for', fieldId);

  return label;
}

function createErrorMsg() {
  const errorMsg = document.createElement('label');
  errorMsg.classList.add('form-field__error');
  errorMsg.classList.add('hidden');
  errorMsg.innerText = 'Field is incorrect';

  return errorMsg;
}

function createInputField(
  fieldId: string,
  fieldType: string,
  pattern: string,
  validators: ValidatorOptions
) {
  const field = document.createElement('input');
  field.classList.add('form-field__input');
  field.setAttribute('id', fieldId);
  field.setAttribute('name', fieldId);
  field.setAttribute('type', fieldType);
  field.setAttribute('required', '');
  field.setAttribute('aria-required', 'true');

  //set listeners on field
  field.addEventListener('change', (e) => {
    const text = field.value;
    const errorLabel = field.parentElement?.querySelector('.form-field__error');

    const { success, errMsg } = validator(pattern, text, validators);

    if (success) {
      errorLabel?.classList.add('hidden');

      field.setAttribute('aria-invalid', 'false');

      field.classList.remove('error');
      field.classList.add('success');
    } else {
      errorLabel?.classList.remove('hidden');
      field.setAttribute('aria-invalid', 'true');

      field.classList.remove('success');
      field.classList.add('error');

      if (errorLabel) errorLabel.textContent = errMsg;
    }
  });

  return field;
}

export function validator(
  pattern: string,
  text: string,
  options: ValidatorOptions
): { success: boolean; errMsg: string } {
  let errMsg = '';

  const regExp = new RegExp(pattern);
  const success = regExp.test(text);

  if (options.noSpace && /\s/.test(text)) {
    errMsg = 'No spaces are allowed.';
  }

  if (options.minLength && text.length < options.minLength) {
    errMsg = `Too short. Must be ${options.minLength} characters or more.`;
  }

  if (options.noNumbers && /[0-9]/.test(text)) {
    errMsg = 'No numbers are allowed.';
  }

  if (options.email) {
    errMsg = 'Not a valid email address.';
  }

  return { success, errMsg };
}
