export default {
	updateIsSending: value => (state, actions) => {
		return {isSending: value};
	},
	updateSendingHw: value => (state, actions) => {
		return {sendingHw: value};
	},
};
