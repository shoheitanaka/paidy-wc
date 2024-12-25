import { render, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Button, Modal, TextControl } from '@wordpress/components';
import PaidyWizardExplain from './explain';
import paidyWizardApply from './paidy-wizard-apply';
import paidyWizardSecurity from './paidy-wizard-security';
import paidyWizardAgreement from './paidy-wizard-agreement';
