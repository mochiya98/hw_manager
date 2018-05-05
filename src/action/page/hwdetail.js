export default {
	updateIsCommentSending: value => (state, actions) => {
		return {isCommentSending: value};
	},
	updateIsHomeworkRemoving: value => (state, actions) => {
		return {isHomeworkRemoving: value};
	},
};
