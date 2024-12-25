import { Button } from '@wordpress/components';

export const NextButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
            { __( 'Next', 'paidy-wc' ) }
        </Button>
    );
};

export const SaveButton = ( { onClick } ) => {
    return (
        <Button variant="primary" onClick={ onClick } __next40pxDefaultSize>
            { __( 'Save', 'paidy-wc' ) }
        </Button>
    );
}
