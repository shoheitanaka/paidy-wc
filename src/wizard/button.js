import { Button } from '@wordpress/components';

export const NextButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick }>
            { __( 'Next', 'paidy-wc' ) }
        </Button>
    );
};

export const SaveButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick }>
            { __( 'Save', 'paidy-wc' ) }
        </Button>
    );
}
