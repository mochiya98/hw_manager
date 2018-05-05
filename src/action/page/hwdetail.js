export default {
	updateIsSendingComment: value => (state, actions) => {
		return {isSendingComment: value};
	},
	updateIsRemovingHomework: value => (state, actions) => {
		return {isRemovingHomework: value};
	},
};
