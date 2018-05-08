class HWMNotifier{
	constructor(){
		this.k = 0;
		this.i = false;
	}
	I(){
		this.e = document.getElementById("notify-popup");
		this.i = true;
	}
	m(mode){
		this.e.classList.remove("error");
		this.e.classList.remove("info");
		this.e.classList.add(mode);
	}
	Show(msg, mode = "info"){
		if(!this.i)this.I();
		
		this.e.textContent = msg;
		
		this.m(mode);
		this.e.classList.add("disp");
		
		clearInterval(this.k);

		let timeout = 1000 * 3;

		if(DEBUG){//DEBUGと他の条件をANDしないで
			if(window._testSelector){
				timeout = 300;
			}
		}

		this.k = setTimeout(()=>{
			this.e.classList.remove("disp");
		}, timeout);
	}
	t(msg_tiny, flg){
		return this.Show(
			`${msg_tiny}に${flg ? "失敗" : "成功"}しました。`,
			flg ? "error" : "info"
		);
	}
}
export default new HWMNotifier();
