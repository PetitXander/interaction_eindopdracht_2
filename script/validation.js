
let email = {},
	signInButton;


const isValidEmailAddress = function (emailAddress) {
	// Basis manier e-mail checken.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function (fieldValue) {
	return !fieldValue || !fieldValue.length;
};



const doubleCheckEmailAddress = function () {
	if (isValidEmailAddress(email.input.value)) {
		// het is ok
		email.input.removeEventListener('input', doubleCheckEmailAddress);
		removeErrors(email);
	} else {

		if (isEmpty(email.input.value)) {
			email.errorMessage.innerText = 'This field is required';
		} else {
			email.errorMessage.innerText = 'Invalid emailaddress';
		}
	}
};

const addErrors = function (formField) {
	formField.field.classList.add('has-error');
	formField.errorMessage.classList.add('is-visible');
};

const removeErrors = function (formField) {
	formField.field.classList.remove('has-error');
	formField.errorMessage.classList.remove('is-visible');
};


const getDOMElements = function () {
	email.label = document.querySelector('.js-email-label');
	email.errorMessage = email.label.querySelector('.js-email-error-message');
	email.input = document.querySelector('.js-email-input');
	email.field = document.querySelector('.js-email-field');

	signInButton = document.querySelector('.js-sub-button');
};

const enableListeners = function () {
	email.input.addEventListener('blur', function () {
		if (!isValidEmailAddress(email.input.value)) {
			if (isEmpty(email.input.value)) {
				email.errorMessage.innerText = 'This field is required';
			} else {
				email.errorMessage.innerText = 'Invalid emailaddress';
			}

			addErrors(email);

			
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});

	signInButton.addEventListener('click', function (e) {
		
		e.preventDefault();

		if (isValidEmailAddress(email.input.value)) {
			email.input.classList.add('is-done');
			email.input.value = '';
			signInButton.innerText = 'THANKS!';
			setTimeout(removeDone, 3000);
			console.log('Form is good to go!');
		} else {
			
			addErrors(email);
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});
};
const removeDone = () => {
	email.input.classList.remove('is-done');
	signInButton.innerText = 'Subscribe!';
};


document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM');

	
	getDOMElements();
	enableListeners();
});

