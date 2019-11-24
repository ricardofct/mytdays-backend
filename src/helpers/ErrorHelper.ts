import { Error } from 'mongoose';

const getErrorMessage = (error: any): string[] => {
    const errors = [];
    if (error instanceof Error.ValidationError) {
        Object.keys(error.errors).forEach(
            key => errors.push(error.errors[key].message)
        );
    } else if (error.message) {
        errors.push(error.message);
    }
    return errors;
}

export default { getErrorMessage };

