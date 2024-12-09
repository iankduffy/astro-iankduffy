import { useReducer, type FormEvent } from "react";
import { flushSync } from "react-dom";

type FormState = 'travel-form' | 'confirmation';

export interface FormInputs {
    firstName: string;
    lastName: string;
    passportNumber: string;
    passportExpiry: string;
}

interface FormAction {
    type: 'SET_FORM_SUBMIT' | 'SET_FORM_CANCELLED';
    payload?: FormInputs;
}

interface ReducerState {
    formState: FormState;
    formData: FormInputs | undefined
}

function formReducer(state: ReducerState, action: FormAction ): ReducerState {
    switch (action.type) {
        case 'SET_FORM_SUBMIT': 
            return { formState: 'confirmation', formData: action.payload };
        case 'SET_FORM_CANCELLED': 
            return { ...state, formState: 'travel-form' };
        default:
            return state;
    }
}

export function FormWrapper({data = undefined}) {
    const [state, dispatch] = useReducer(formReducer, { 
    	formState: 'travel-form',
		formData: data
	});

    const moveToConfirmation = (formData: FormInputs) => {
        document.startViewTransition({ update: () => dispatch({ type: 'SET_FORM_SUBMIT', payload: formData }), types: ['forwards']})
    }

    const moveBackToForm = () => {
        document.startViewTransition({ update: () => dispatch({ type: 'SET_FORM_CANCELLED' }), types: ['backwards']})
        // document.startViewTransition(() => {
        //     dispatch({ type: 'SET_FORM_CANCELLED' });
        // })
    }

    if (state.formState === 'confirmation') {
        return <Confirmation data={state.formData} moveBackToForm={moveBackToForm} />;
    }

    return (<TravelForm moveToConfirmation={moveToConfirmation} formData={state.formData}/>);
}

function TravelForm ({moveToConfirmation, formData}) {
    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        moveToConfirmation({firstName: formData.get('firstName'), lastName: formData.get('lastName'), passportNumber: formData.get('passportNumber'), passportExpiry: formData.get('passportExpiry')});
    }
    return (
        <form onSubmit={submitForm}>
            <h1>Travel Form</h1>
            <label htmlFor='firstName'>
                <input type="text" placeholder="First Name" name="firstName" defaultValue={formData?.firstName} />
            </label>
            <label htmlFor='lastName'>
                <input type="text" placeholder="Last Name" name="lastName" defaultValue={formData?.lastName} />
            </label>
            <label htmlFor='passportNumber'>
                <input type="text" placeholder="Passport Number" name="passportNumber" defaultValue={formData?.passportNumber}  />
            </label>
            <label htmlFor='passportExpiry'>
                <input type="date" placeholder="Passport Expiry" name="passportExpiry" defaultValue={formData?.passportExpiry}  />
            </label>
            <button>Save</button>
        </form>
    )
}

function Confirmation({data, moveBackToForm}) {
    return (
        <div>
            <h1>Confirmation</h1>
            <p>First Name: {data.firstName}</p>
            <p>Last Name: {data.lastName}</p>
            <p>Passport Number: {data.passportNumber}</p>
            <p>Passport Expiry: {data.passportExpiry}</p>
            <div>
                <button onClick={moveBackToForm}>Cancel</button>
                <button>Confirm</button>
            </div>
        </div>
    )
}