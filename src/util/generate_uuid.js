export default function(){
	const chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c){
		const tflg = c === "x";
		return (Math.floor(Math.random() * (tflg ? 16 : 4)) + (tflg ? 0 : 8)).toString(16);
	});
	return chars;
}
