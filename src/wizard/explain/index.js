/* global wc_stripe_settings_params */
import { __ } from '@wordpress/i18n';
import { ExternalLink } from '@wordpress/components';
import { NextButton } from './button';

export const PaidyWizardExplain = ( { nextStep } ) => {
    return (
        <div>
            <h2>{ __( 'Easy Paidy setup', 'paidy-wc' ) }</h2>
            <p>
                { __(
                    'Applying for and setting up Paidy is easy.',
                    'paidy-wc'
                ) }
            </p>
            <p>
                { __(
                    'Paidy payment with installation cost of 0 yen and payment fee of 3.5%.',
                    'paidy-wc'
                ) }
		        <ExternalLink href="">
			        { __( 'Learn more', 'paidy-wc' ) }
		        </ExternalLink>
            </p>
            <NextButton onClick={ nextStep } />
        </div>
    );
}
