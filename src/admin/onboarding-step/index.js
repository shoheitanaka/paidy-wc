import { __ } from '@wordpress/i18n';
import { 
    PaidyTitle,
    ApplyButton,
    UnderReviewMessage,
} from '../components';
import {
	ReviewRejectedMessage,
	ReviewApprovedMessage,
} from '../../main-hooks/form-info';
import {
	useOnBoardingSettings,
} from '../../main-hooks/on-boarding-settings';

export const OnBoardingStep = () => {
    const {
        currentStep
    } = useOnBoardingSettings();

	if ( currentStep === 2 ) {
        return (
            <div>
            <PaidyTitle />
            <UnderReviewMessage />
            </div>
        );
    } else if ( currentStep === 3 ) {
        return (
            <div>
            <PaidyTitle />
            <ReviewApprovedMessage />
            </div>
        );
    } else if ( currentStep === 99 ) {
        return (
            <div>
            <PaidyTitle />
            <ReviewRejectedMessage />
            </div>
        );
    } else {
        return (
            <div>
            <PaidyTitle />
            <ApplyButton/>
            </div>
        );
    }
}