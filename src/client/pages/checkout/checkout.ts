import { View, ValidatorOptions } from '@/types';
import formField, { validator } from '@/components/formField/formField';

class Checkout implements View {
  checkout: HTMLElement;

  constructor() {
    this.checkout = document.createElement('div');
    this.checkout.classList.add('checkout');

    const title = document.createElement('h2');
    title.innerText = 'Checkout';

    this.checkout.appendChild(title);

    this.checkout.appendChild(this.buildForm());
  }

  render() {
    return this.checkout;
  }

  afterRender() {
    //
  }

  unmount() {
    //
  }

  buildForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add('checkout__form');

    const nameData = {
      pattern: '^[a-zA-Z-]{3,}$',
      validators: {
        noSpace: true,
        noNumbers: true,
        minLength: 3,
      },
    };

    const addressData = {
      pattern: "^[\\w -.']{7,}$",
      validators: {
        minLength: 7,
      },
    };

    const emailData = {
      pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]{2,}$',
      validators: {
        email: true,
      },
    };

    const phoneNumber = {
      pattern:
        '^(\\+\\d{1,2}\\s?)?1?\\-?\\.?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$',
      validators: {
        minLength: 9,
      },
    };

    form.appendChild(
      formField(
        'firstName',
        'text',
        nameData.pattern,
        'First Name',
        nameData.validators
      )
    );
    form.appendChild(
      formField(
        'lastName',
        'text',
        nameData.pattern,
        'Last Name',
        nameData.validators
      )
    );

    form.appendChild(
      formField(
        'address',
        'text',
        addressData.pattern,
        'Address',
        addressData.validators
      )
    );

    form.appendChild(
      formField(
        'email',
        'email',
        emailData.pattern,
        'Email',
        emailData.validators
      )
    );

    form.appendChild(
      formField(
        'phoneNumber',
        'number',
        phoneNumber.pattern,
        'Phone Number',
        phoneNumber.validators
      )
    );

    const submit = document.createElement('button');
    submit.innerText = 'Submit';
    submit.classList.add('btn');
    submit.classList.add('btn--submit');
    submit.setAttribute('type', 'submit');

    form.appendChild(submit);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const firstName = document.getElementById(
        'firstName'
      ) as HTMLInputElement;
      const lastName = document.getElementById('lastName') as HTMLInputElement;
      const address = document.getElementById('address') as HTMLInputElement;
      const email = document.getElementById('email') as HTMLInputElement;
      const phone = document.getElementById('phoneNumber') as HTMLInputElement;

      const fnSuccess = validator(
        nameData.pattern,
        firstName.value,
        nameData.validators
      ).success;

      const lnSuccess = validator(
        nameData.pattern,
        lastName.value,
        nameData.validators
      ).success;

      const addSuccess = validator(
        addressData.pattern,
        address.value,
        addressData.validators
      ).success;

      const emSuccess = validator(
        emailData.pattern,
        email.value,
        emailData.validators
      ).success;

      const pnSuccess = validator(
        phoneNumber.pattern,
        phone.value,
        phoneNumber.validators
      ).success;

      if (fnSuccess && lnSuccess && addSuccess && emSuccess && pnSuccess) {
        //submit
        console.log('submitted');
      }
    });

    return form;
  }
}

export default Checkout;
