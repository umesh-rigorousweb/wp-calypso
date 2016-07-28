module.exports = function( report, lines, rulesToNotDowngrade ) {
	// deep clone the report, so we can create a new one
	// to tweak and edit in place - as this function remains pure.
	const newReport = JSON.parse( JSON.stringify( report ) );

	// If lines is an empty object {} we should not filter the report.
	if ( ( Object.keys( lines ).length === 0 ) && ( lines.constructor === Object ) ) {
		return newReport;
	}

	const isLineModified = ( line, whiteList ) => {
		// We expect the function to be passed the same files
		// within the ESLint report object and the lines object.
		// Nevertheless, if lines object does not contain a file
		// which the ESLint report object has, we set that line
		// as unmodifed - precaution principle.
		if ( ! whiteList ) {
			return false;
		}
		return whiteList.indexOf( line ) > -1;
	};

	const isMessageAnError = severity => {
		return severity === 2;
	};

	const isRuleToNotDowngrade = ( ruleId, toNotDowngrade ) => {
		if ( ! Array.isArray( toNotDowngrade ) ) {
			return false;
		}
		return toNotDowngrade.indexOf( ruleId ) > -1;
	};

	// errors which are not in the whitelisted lines are downgraded to warnings
	// except those in rules that we do not want to downgrade
	newReport.forEach( file => {
		file.messages.forEach( message => {
			if ( ! isLineModified( message.line, lines[ file.filePath ] ) &&
			isMessageAnError( message.severity ) ) {
				if ( ! isRuleToNotDowngrade( message.ruleId, rulesToNotDowngrade ) ) {
					message.severity = 1;
					file.warningCount ++;
					file.errorCount--;
				}
			}
		} );
	} );

	return newReport;
};