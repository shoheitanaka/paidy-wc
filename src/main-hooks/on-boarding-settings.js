import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

const useOnBoardingSettings = () => {
	const [ currentStep, setCurrentStep ] = useState();
	const [ storeName, setStoreName ] = useState();
	const [ siteName, setSiteName ] = useState();
	const [ storeUrl, setStoreUrl ] = useState();
	const [ registEmail, setRegistEmail ] = useState();
	const [ contactPhone, setContactPhone ] = useState();
	const [ representativeLastName, setRepesentativeLastName ] = useState();
	const [ representativeFirstName, setRepresentativeFirstName ] = useState();
	const [ representativeLastNameKana, setRepresentativeLastNameKana ] = useState();
	const [ representativeFirstNameKana, setRepresentativeFirstNameKana ] = useState();
	const [ representativeDateOfBirth, setRepresentativeDateOfBirth ] = useState();
	const [ annualGrossValue, setAnnualGrossValue ] = useState();
	const [ averagePurchaseAmount, setAveragePurchaseAmount ] = useState();
	const [ securitySurvey01CheckControl, setSecuritySurvey01CheckControl ] = useState( false );
	const [ securitySurvey02CheckControl, setSecuritySurvey02CheckControl ] = useState( false );
	const [ securitySurvey03CheckControl, setSecuritySurvey03CheckControl ] = useState( false );
	const [ securitySurvey04CheckControl, setSecuritySurvey04CheckControl ] = useState( false );
	const [ securitySurvey05CheckControl, setSecuritySurvey05CheckControl ] = useState( false );
	const [ securitySurvey06CheckControl, setSecuritySurvey06CheckControl ] = useState( false );
	const [ securitySurvey07CheckControl, setSecuritySurvey07CheckControl ] = useState( false );
	const [ securitySurvey08CheckControl, setSecuritySurvey08CheckControl ] = useState( false );
	const [ securitySurvey09CheckControl, setSecuritySurvey09CheckControl ] = useState( false );

	const { createErrorNotice, createSuccessNotice } = useDispatch( noticesStore );

	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } ).then( ( settings ) => {
			setCurrentStep( settings.woocommerce_paidy_on_boarding_settings.currentStep );
			setStoreName( settings.woocommerce_paidy_on_boarding_settings.storeName );
			setSiteName( settings.woocommerce_paidy_on_boarding_settings.siteName );
			setStoreUrl( settings.woocommerce_paidy_on_boarding_settings.storeUrl );
			setRegistEmail( settings.woocommerce_paidy_on_boarding_settings.registEmail );
			setContactPhone( settings.woocommerce_paidy_on_boarding_settings.contactPhone );
			setRepesentativeLastName( settings.woocommerce_paidy_on_boarding_settings.representativeLastName );
			setRepresentativeFirstName( settings.woocommerce_paidy_on_boarding_settings.representativeFirstName );
			setRepresentativeLastNameKana( settings.woocommerce_paidy_on_boarding_settings.representativeLastNameKana );
			setRepresentativeFirstNameKana( settings.woocommerce_paidy_on_boarding_settings.representativeFirstNameKana );
			setRepresentativeDateOfBirth( settings.woocommerce_paidy_on_boarding_settings.representativeDateOfBirth );
			setAnnualGrossValue( settings.woocommerce_paidy_on_boarding_settings.annualGrossValue );
			setAveragePurchaseAmount( settings.woocommerce_paidy_on_boarding_settings.averagePurchaseAmount );
			setSecuritySurvey01CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey01CheckControl );
			setSecuritySurvey02CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey02CheckControl );
			setSecuritySurvey03CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey03CheckControl );
			setSecuritySurvey04CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey04CheckControl );
			setSecuritySurvey05CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey05CheckControl );
			setSecuritySurvey06CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey06CheckControl );
			setSecuritySurvey07CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey07CheckControl );
			setSecuritySurvey08CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey08CheckControl );
			setSecuritySurvey09CheckControl( settings.woocommerce_paidy_on_boarding_settings.securitySurvey09CheckControl );
		} );
	}, [] );

	const saveSettings = () => {
		let requiredFlag = false;
		const requiredFields = [
			{ value: storeName, label: __( 'Trade name / Store name', 'paidy-wc' ) },
			{ value: siteName, label: __( 'Your EC site name', 'paidy-wc' ) },
			{ value: storeUrl, label: __( 'Store URL', 'paidy-wc' ) },
			{ value: registEmail, label: __( 'Email address for registering Paidy', 'paidy-wc' ) },
			{ value: contactPhone, label: __( 'Contact phone number', 'paidy-wc' ) },
			{ value: representativeLastName, label: __( 'Representative (last name)', 'paidy-wc' ) },
			{ value: representativeFirstName, label: __( 'Representative (first name)', 'paidy-wc' ) },
			{ value: representativeLastNameKana, label: __( 'Representative (last name kana)', 'paidy-wc' ) },
			{ value: representativeFirstNameKana, label: __( 'Representative (first name kana)', 'paidy-wc' ) },
			{ value: representativeDateOfBirth, label: __( 'Representative\'s date of birth (Gregorian calendar)', 'paidy-wc' ) },
		];
		requiredFields.forEach( ( field ) => {
			if ( ! field.value ) {
				createErrorNotice(
					__( '%s is a required field. Please enter it.', 'paidy-wc').replace( '%s', field.label ),
					{ type: 'snackbar', isDismissible: true, autoDismiss: false }
				);
				requiredFlag = true;
			}
		} );

		let kanaFlag = false;
		const fullWidthKatakanaRegex = /^[ァ-ヶー]+$/;
		const requiredKanaFields = [
			{ value: representativeLastNameKana, label: __( 'Representative (last name kana)', 'paidy-wc' ) },
			{ value: representativeFirstNameKana, label: __( 'Representative (first name kana)', 'paidy-wc' ) },
		];
		requiredKanaFields.forEach( ( field ) => {
			if ( ! fullWidthKatakanaRegex.test( field.value ) ) {
				createErrorNotice(
					__( '%s must be in full-width katakana. Please confirm.', 'paidy-wc').replace( '%s', field.label ),
					{ type: 'snackbar', isDismissible: true, autoDismiss: false }
				);
			kanaFlag = true;
			}
		} );

		if ( requiredFlag  ) {
			createErrorNotice(
				__( 'Please fill in all the fields.', 'paidy-wc' ),
				 { type: 'snackbar', isDismissible: true, autoDismiss: false }
			);
			return;
		}

		if ( kanaFlag ) {
			return;
		}

		setCurrentStep( currentStep + 1 );

		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				woocommerce_paidy_on_boarding_settings: {
					currentStep,
					storeName,
					siteName,
					storeUrl,
					registEmail,
					contactPhone,
					representativeLastName,
					representativeFirstName,
					representativeLastNameKana,
					representativeFirstNameKana,
					representativeDateOfBirth,
					annualGrossValue,
					averagePurchaseAmount,
					securitySurvey01CheckControl,
					securitySurvey02CheckControl,
					securitySurvey03CheckControl,
					securitySurvey04CheckControl,
					securitySurvey05CheckControl,
					securitySurvey06CheckControl,
					securitySurvey07CheckControl,
					securitySurvey08CheckControl,
					securitySurvey09CheckControl,
				},
			},
		} ).then( () => {
			createSuccessNotice(
				__( 'Settings saved.', 'paidy-wc' )
			);
		} );
	};

	return {
        currentStep,
		setCurrentStep,
		storeName,
		setStoreName,
		siteName,
		setSiteName,
		storeUrl,
		setStoreUrl,
		registEmail,
		setRegistEmail,
		contactPhone,
		setContactPhone,
		representativeLastName,
		setRepesentativeLastName,
		representativeFirstName,
		setRepresentativeFirstName,
		representativeLastNameKana,
		setRepresentativeLastNameKana,
		representativeFirstNameKana,
		setRepresentativeFirstNameKana,
		representativeDateOfBirth,
		setRepresentativeDateOfBirth,
		annualGrossValue,
		setAnnualGrossValue,
		averagePurchaseAmount,
		setAveragePurchaseAmount,
		securitySurvey01CheckControl,
		setSecuritySurvey01CheckControl,
		securitySurvey02CheckControl,
		setSecuritySurvey02CheckControl,
		securitySurvey03CheckControl,
		setSecuritySurvey03CheckControl,
		securitySurvey04CheckControl,
		setSecuritySurvey04CheckControl,
		securitySurvey05CheckControl,
		setSecuritySurvey05CheckControl,
		securitySurvey06CheckControl,
		setSecuritySurvey06CheckControl,
		securitySurvey07CheckControl,
		setSecuritySurvey07CheckControl,
		securitySurvey08CheckControl,
		setSecuritySurvey08CheckControl,
		securitySurvey09CheckControl,
		setSecuritySurvey09CheckControl,
        saveSettings,
    };
};

export {
	useOnBoardingSettings
};